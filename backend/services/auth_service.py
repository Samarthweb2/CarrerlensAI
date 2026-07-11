from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from database.models import User
from schemas.auth import UserCreate, UserLogin
from utils.password import hash_password, verify_password

def get_user_by_email(db: Session, email: str):
    """
    Retrieves a user profile by email query.
    """
    return db.query(User).filter(User.email == email).first()

def register_user(db: Session, user_data: UserCreate, background_tasks=None):
    """
    Creates a new user record in database, generates a verification code, and triggers signup emails.
    """
    import random
    import os
    from services import email_service

    # Check for duplicate email
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Hash the password
    hashed_pwd = hash_password(user_data.password)
    verification_otp = f"{random.randint(100000, 999999)}"

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hashed_pwd,
        is_verified=False,
        verification_code=verification_otp
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Send verification email asynchronously/directly
    if background_tasks:
        background_tasks.add_task(email_service.send_verification_otp, new_user.email, new_user.full_name, verification_otp)
    else:
        try:
            email_service.send_verification_otp(new_user.email, new_user.full_name, verification_otp)
        except Exception as e:
            print(f"Error sending verification code email: {e}")

    return new_user


def authenticate_user(db: Session, login_data: UserLogin):
    """
    Validates user credentials and returns the profile.
    """
    user = get_user_by_email(db, login_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong Password. Please double check your email and credentials."
        )

    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong Password. Please double check your email and credentials."
        )

    return user
