import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)

SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = os.environ.get("SMTP_PORT")
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
SMTP_FROM = os.environ.get("SMTP_FROM", "noreply@careerlensai.com")

def _send_email(to_email: str, subject: str, html_content: str):
    """
    Core utility to send emails. Falls back to writing to local logs/console if credentials are not configured.
    """
    if SMTP_HOST and SMTP_PORT and SMTP_USER and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = SMTP_FROM
            msg["To"] = to_email
            
            part = MIMEText(html_content, "html")
            msg.attach(part)
            
            with smtplib.SMTP(SMTP_HOST, int(SMTP_PORT)) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(SMTP_FROM, to_email, msg.as_string())
            logger.info(f"Successfully sent email to {to_email}: {subject}")
            return True
        except Exception as e:
            logger.error(f"Failed to send real SMTP email to {to_email}: {e}")
            # Fallback to simulation
    
    # Simulation logic
    debug_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads", "email_logs")
    os.makedirs(debug_dir, exist_ok=True)
    log_file = os.path.join(debug_dir, "sent_emails.log")
    
    email_log_entry = f"""
===================================================================
[SIMULATED EMAIL SENT]
Timestamp: {os.path.getmtime(debug_dir) if os.path.exists(debug_dir) else "Now"}
To: {to_email}
Subject: {subject}
Content:
-------------------------------------------------------------------
{html_content}
===================================================================
"""
    print(email_log_entry) # Prints directly to FastAPI console
    try:
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(email_log_entry)
    except Exception as e:
        logger.error(f"Failed to write email simulation to log file: {e}")
    return True

def send_verification_otp(email: str, name: str, otp: str):
    subject = "Verify your CareerLensAI Account"
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #1F1F1F; background-color: #FFFDF9; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; border: 3px solid #1F1F1F; border-radius: 16px; background: white; padding: 30px; box-shadow: 6px 6px 0px #1F1F1F;">
          <h2 style="color: #7C5CFF; font-weight: 900;">Welcome to CareerLensAI, {name}! 🤖</h2>
          <p style="font-size: 14px; font-weight: bold;">Verify your email address using the 6-digit OTP code below:</p>
          <div style="background-color: #FFD54F; border: 2px solid #1F1F1F; border-radius: 12px; padding: 15px; font-size: 32px; font-weight: 900; letter-spacing: 5px; text-align: center; margin: 20px 0; color: #1F1F1F; box-shadow: 4px 4px 0px #1F1F1F;">
            {otp}
          </div>
          <p style="font-size: 12px; font-weight: bold; color: #7A7A7A;">This OTP is valid for 15 minutes. If you did not sign up for an account, please ignore this email.</p>
        </div>
      </body>
    </html>
    """
    return _send_email(email, subject, html)

def send_password_reset(email: str, name: str, code: str):
    subject = "Reset your CareerLensAI Password"
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #1F1F1F; background-color: #FFFDF9; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; border: 3px solid #1F1F1F; border-radius: 16px; background: white; padding: 30px; box-shadow: 6px 6px 0px #1F1F1F;">
          <h2 style="color: #7C5CFF; font-weight: 900;">Password Reset Request</h2>
          <p style="font-size: 14px; font-weight: bold;">Hi {name}, we received a request to reset your password. Use the following code to reset it:</p>
          <div style="background-color: #FF8A50; border: 2px solid #1F1F1F; border-radius: 12px; padding: 15px; font-size: 32px; font-weight: 900; letter-spacing: 5px; text-align: center; margin: 20px 0; color: #1F1F1F; box-shadow: 4px 4px 0px #1F1F1F;">
            {code}
          </div>
          <p style="font-size: 12px; font-weight: bold; color: #7A7A7A;">If you did not request this password reset, please ignore this email or contact support.</p>
        </div>
      </body>
    </html>
    """
    return _send_email(email, subject, html)

def send_welcome_email(email: str, name: str):
    subject = "Welcome to CareerLensAI!"
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #1F1F1F; background-color: #FFFDF9; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; border: 3px solid #1F1F1F; border-radius: 16px; background: white; padding: 30px; box-shadow: 6px 6px 0px #1F1F1F;">
          <h2 style="color: #4CAF50; font-weight: 900;">Your Resume is in Good Hands! 🚀</h2>
          <p style="font-size: 14px; font-weight: bold;">Hi {name}, your CareerLensAI account has been successfully verified!</p>
          <p style="font-size: 14px; line-height: 1.6;">You can now upload your resume, compare versions, track keyword scores against target job descriptions, and practice custom mock interviews tailored just for you!</p>
          <p style="font-size: 14px; font-weight: 900; color: #7C5CFF;">Let's land that dream job! 🎯</p>
        </div>
      </body>
    </html>
    """
    return _send_email(email, subject, html)
