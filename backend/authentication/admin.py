from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'first_name', 'last_name', 'is_active', 'is_staff', 'email_verified']
    list_filter = ['is_active', 'is_staff', 'email_verified', 'date_joined']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Email Verification', {'fields': ('email_verified', 'verification_code', 'verification_code_expiry')}),
        ('Password Reset', {'fields': ('reset_token', 'reset_token_expiry')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['email']

admin.site.register(CustomUser, CustomUserAdmin)