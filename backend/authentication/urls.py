from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)

from .views import get_csrf_token, login, send_reset_password_email, signup, reset_password, verify_email, resend_verification_code

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("login/", login, name="login"),
    path("signup/", signup, name="signup"),
    path("verify_email/", verify_email, name="verify_email"),
    path("resend_verification_code/", resend_verification_code, name="resend_verification_code"),
    path("send_reset_password_email/", send_reset_password_email, name="send_reset_password_email"),
    path("reset_password/", reset_password, name="reset_password"),
    path("csrf_token/", get_csrf_token, name="get_csrf_token")
]
