from django.utils import timezone
from datetime import timedelta
import re

from django.conf import settings
from .serializer import UserSerializer
import jwt
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework.permissions import IsAuthenticated
from .mail import send_reset_email, send_verification_email
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.contrib.auth import get_user_model
User = get_user_model()

def validate_password_strength(password):
    """
    Validate password strength requirements:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)"
    
    return True, "Password is strong"

# Create your views here.
@api_view(["POST"])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"success": False, "message": "Email and password are required"},
            status=400,
        )

    user = authenticate(request, email=email, password=password)

    if user is None:
        return Response(
            {"success": False, "message": "Invalid email or password"},
            status=401,
        )
    
    # Check if email is verified
    if not user.email_verified:
        return Response(
            {"success": False, "message": "Please verify your email address before logging in", "requires_verification": True, "email": user.email},
            status=403,
        )

    access = AccessToken.for_user(user)
    refresh = RefreshToken.for_user(user)

    user_payload = {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name}

    return Response(
        {
            "success": True,
            "message": "Login successful",
            "user": user_payload,
            "access": str(access),
            "refresh": str(refresh),
        }
    )

@api_view(["POST"])
def signup(request):
    email = request.data.get("email")
    password = request.data.get("password")
    password_confirmation = request.data.get("password_confirmation")
    first_name = request.data.get("first_name", "")
    last_name = request.data.get("last_name", "")

    if not email or not password:
        return Response(
            {"success": False, "message": "Email and password are required"}, status=400
        )

    if password != password_confirmation:
        return Response(
            {"success": False, "message": "Passwords do not match"}, status=400
        )

    # Validate password strength
    is_valid, validation_message = validate_password_strength(password)
    if not is_valid:
        return Response(
            {"success": False, "message": validation_message}, status=400
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"success": False, "message": "Email already exists"}, status=400
        )

    user = User.objects.create_user(
        email=email, password=password, first_name=first_name, last_name=last_name, is_active=False
    )
    
    
    send_verification_email(user)
    
    return Response(
        {
            "success": True,
            "message": "User created successfully. Please check your email for verification code.",
        },
        status=201,
    )

@api_view(["POST"])
def send_reset_password_email(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=400)

    user = User.objects.filter(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=404)

    # Generate a reset token and expiry
    user.reset_token = jwt.encode({"user_id": user.id}, "secret", algorithm="HS256")
    user.reset_token_expiry = timezone.now() + timedelta(hours=1)
    user.save()

    # Send email with reset link (pseudo code)
    send_reset_email(user)

    return Response({"message": "Password reset email sent"}, status=200)

@api_view(["POST"])
def reset_password(request):
    token = request.data.get("token")
    new_password = request.data.get("new_password")
    new_password_confirmation = request.data.get("new_password_confirmation")

    if not token or not new_password or not new_password_confirmation:
        return Response({"error": "Token and new passwords are required"}, status=400)

    if new_password != new_password_confirmation:
        return Response({"error": "Passwords do not match"}, status=400)

    # Validate password strength
    is_valid, validation_message = validate_password_strength(new_password)
    if not is_valid:
        return Response({"error": validation_message}, status=400)

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
    except jwt.ExpiredSignatureError:
        return Response({"error": "Token has expired"}, status=400)
    except jwt.InvalidTokenError:
        return Response({"error": "Invalid token"}, status=400)

    user = User.objects.filter(id=user_id, reset_token=token).first()
    if not user:
        return Response({"error": "Invalid token or user not found"}, status=404)

    if user.reset_token_expiry < timezone.now():
        return Response({"error": "Token has expired"}, status=400)

    user.set_password(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    user.save()

    return Response({"message": "Password has been reset successfully"}, status=200)

@api_view(["POST"])
def verify_email(request):
    email = request.data.get("email")
    verification_code = request.data.get("verification_code")
    
    if not email or not verification_code:
        return Response({"error": "Email and verification code are required"}, status=400)
    
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=404)
    
    if user.email_verified:
        return Response({"error": "Email already verified"}, status=400)
    
    if not user.verification_code or user.verification_code != verification_code:
        return Response({"error": "Invalid verification code"}, status=400)
    
    if user.verification_code_expiry < timezone.now():
        return Response({"error": "Verification code has expired"}, status=400)
    
    # Activate user and clear verification code
    user.email_verified = True
    user.is_active = True
    user.verification_code = None
    user.verification_code_expiry = None
    user.save()
    
    # Generate tokens for the verified user
    access = AccessToken.for_user(user)
    refresh = RefreshToken.for_user(user)
    user_payload = {"id": user.id, "email": user.email}
    
    return Response({
        "success": True,
        "message": "Email verified successfully",
        "user": user_payload,
        "access": str(access),
        "refresh": str(refresh),
    }, status=200)

@api_view(["POST"])
def resend_verification_code(request):
    email = request.data.get("email")
    
    if not email:
        return Response({"error": "Email is required"}, status=400)
    
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=404)
    
    if user.email_verified:
        return Response({"error": "Email already verified"}, status=400)
    
    # Send new verification email
    send_verification_email(user)
    
    return Response({"message": "Verification code sent successfully"}, status=200)

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"detail": "CSRF cookie set"})