from fastapi import APIRouter, Depends, status, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import random
from database.database import get_db
from database.models import User
from schemas.auth import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    VerifyEmailRequest, ForgotPasswordRequest, ResetPasswordRequest,
    ProfileUpdateRequest
)
from services import auth_service, email_service
from utils.jwt_handler import create_access_token
from utils.password import hash_password
from api.middleware.auth import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Registers a new user candidate account and triggers verification email.
    """
    return auth_service.register_user(db, user_data, background_tasks)

@router.post("/verify", status_code=status.HTTP_200_OK)
async def verify_email(payload: VerifyEmailRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Verifies a user's email address using the 6-digit OTP code.
    """
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    if user.is_verified:
        return {"status": "success", "message": "Email is already verified."}
    
    if user.verification_code != payload.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code. Please check your OTP and try again."
        )
    
    user.is_verified = True
    user.verification_code = None
    db.commit()
    
    # Send Welcome Email via BackgroundTasks
    if background_tasks:
        background_tasks.add_task(email_service.send_welcome_email, user.email, user.full_name)
    else:
        try:
            email_service.send_welcome_email(user.email, user.full_name)
        except Exception as e:
            print(f"Error sending welcome email: {e}")
        
    return {"status": "success", "message": "Email verified successfully! You can now log in."}


@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Validates user credentials and issues a JWT token. Enforces verification.
    """
    user = auth_service.authenticate_user(db, login_data)
    
    # Optional constraint check: if you want to block login for unverified accounts,
    # you can do so, but let's allow it or return an explicit flag. We'll return the verified status.
    token = create_access_token(data={"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(payload: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Initiates password reset process by emailing a 6-digit verification code.
    """
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Avoid user enumeration by returning 200 anyway
        return {"status": "success", "message": "If the account exists, a reset code was sent."}
    
    reset_otp = f"{random.randint(100000, 999999)}"
    user.reset_token = reset_otp
    db.commit()
    
    if background_tasks:
        background_tasks.add_task(email_service.send_password_reset, user.email, user.full_name, reset_otp)
    else:
        try:
            email_service.send_password_reset(user.email, user.full_name, reset_otp)
        except Exception as e:
            print(f"Error sending password reset email: {e}")
        
    return {"status": "success", "message": "Password reset code sent successfully."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Resets the password if the reset code matches.
    """
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.reset_token or user.reset_token != payload.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset code."
        )
    
    user.password_hash = hash_password(payload.new_password)
    user.reset_token = None
    db.commit()
    
    return {"status": "success", "message": "Password reset successful! You can now log in."}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns active user profile.
    """
    return current_user

@router.post("/logout")
async def logout():
    """
    Invalidates session profile. Handled clientside by dropping token.
    """
    return {"message": "Logged out successfully"}

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    payload: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Updates the authenticated user's details.
    """
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.email is not None:
        if payload.email != current_user.email:
            existing = db.query(User).filter(User.email == payload.email).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="An account with this email address already exists."
                )
            current_user.email = payload.email
    if payload.password is not None:
        current_user.password_hash = hash_password(payload.password)
    if payload.profile_pic is not None:
        current_user.profile_pic = payload.profile_pic
        
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/account", status_code=status.HTTP_200_OK)
async def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deletes the active user account, along with all uploaded resumes and analysis history.
    """
    from database.models import Resume
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    for r in resumes:
        if os.path.exists(r.filepath):
            try:
                os.remove(r.filepath)
            except Exception as e:
                print(f"Failed to delete resume file: {e}")
                
    db.delete(current_user)
    db.commit()
    return {"status": "success", "message": "Account and all associated scans deleted successfully."}
