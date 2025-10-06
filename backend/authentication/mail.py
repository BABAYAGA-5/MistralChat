import jwt
import random
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings

def send_reset_email(user):
    # 1. Generate expiry timestamp
    expiry = timezone.now() + timedelta(hours=1)

    # 2. Encode JWT
    token = jwt.encode(
        {
            "user_id": user.id,
            "exp": int(expiry.timestamp())
        },
        settings.SECRET_KEY,           # use secure secret key
        algorithm="HS256"
    )

    # 3. Save token in DB (optional but useful to invalidate early)
    user.reset_token = token
    user.reset_token_expiry = expiry
    user.save()

    # 4. Create reset link
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    # 5. Send email
    subject = "Password Reset Request"
    message = (
        f"Hello {user.first_name + ' ' + user.last_name },\n\n"
        "We received a request to reset your password for your account.\n"
        "Please click the link below to reset your password. This link will expire in 1 hour:\n\n"
        f"{reset_link}\n\n"
        "If you did not request a password reset, please ignore this email.\n\n"
        "Best regards,\n"
        "The Support Team"
    )
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list)

def send_verification_email(user):
    # 1. Generate 6-digit verification code
    verification_code = str(random.randint(100000, 999999))
    
    # 2. Generate expiry timestamp (15 minutes)
    expiry = timezone.now() + timedelta(minutes=30)
    
    # 3. Save verification code in DB
    user.verification_code = verification_code
    user.verification_code_expiry = expiry
    user.save()
    
    # 4. Send verification email
    subject = "Verify Your Email Address"
    message = (
        f"Hello {user.first_name or 'User'},\n\n"
        "Thank you for signing up! Please verify your email address by entering the verification code below:\n\n"
        f"Verification Code: {verification_code}\n\n"
        "This code will expire in 30 minutes.\n\n"
        "If you did not create an account, please ignore this email.\n\n"
        "Best regards,\n"
        "The Support Team"
    )
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]
    
    send_mail(subject, message, from_email, recipient_list)
