# MistralChat - AI-Powered Conversations

A modern, full-stack AI chat application built with Next.js 15 and Django, featuring secure authentication, password reset, email verification, and real-time conversations with Mistral AI.

## 🚀 Features

- **AI Conversations**: Real-time chat with Mistral AI
- **Secure Authentication**: JWT-based auth with CSRF protection
- **Email Verification**: Account verification and password reset
- **Strong Password Policy**: 8+ chars, uppercase, lowercase, number, special character
- **Modern UI**: Responsive design with dark theme and gradients
- **Dockerized**: Ready for production deployment

## 🏗️ Tech Stack

**Frontend:**
- Next.js 15 with App Router
- React 19 with TypeScript
- Tailwind CSS for styling
- Custom authentication context

**Backend:**
- Django 5.2 with REST Framework
- JWT authentication with refresh tokens
- SQLite database (production-ready)
- Email integration for notifications

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **Git** for cloning
- **Email account** for SMTP (Gmail recommended)
- **Mistral AI API key** from [Mistral AI](https://mistral.ai/)

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/BABAYAGA-5/MistralChat.git
cd MistralChat
```

### 2. Backend Setup

#### Create Environment File
**Location:** `backend/.env` (create this file in the backend folder)

```bash
# Navigate to backend folder
cd backend

# Copy the example file to create your .env file
cp .env.example .env
```

**Now edit the file `backend/.env` and replace these values with your own:**
```env
# Replace with your actual Django secret key
SECRET_KEY=your-django-secret-key-here

# Replace with your Mistral AI API key from https://mistral.ai/
MISTRAL_API_KEY=your-mistral-api-key-here

# Replace with your Gmail address
EMAIL_HOST_USER=your-email@gmail.com

# Replace with your Gmail app password (not regular password)
EMAIL_HOST_PASSWORD=your-app-password-here

# Same as your Gmail address
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Keep this as localhost:3000 for development
CSRF_TRUSTED_ORIGINS=http://localhost:3000
```

#### Install Python Dependencies
**Run these commands in the `backend` folder:**

```bash
# Create virtual environment (run this once)
python -m venv env

# Activate virtual environment (run this every time you open terminal)
# On Windows:
env\Scripts\activate
# On macOS/Linux:
source env/bin/activate

# Install all required packages
pip install -r requirements.txt
```

#### Setup Database
**Run these commands in the `backend` folder with virtual environment activated:**

```bash
# Create database tables
python manage.py makemigrations
python manage.py migrate
```

#### Start Backend Server
**Run this command in the `backend` folder:**
```bash
python manage.py runserver
```
✅ **Backend will run on:** http://localhost:8000

### 3. Frontend Setup

**Open a new terminal and navigate to the frontend folder:**

#### Create Environment File
**Location:** `frontend/.env` (create this file in the frontend folder)

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Copy the example file to create your .env file
cp .env_example .env
```

**The `frontend/.env` file is usually fine as-is, but you can edit it if needed:**
```env
# Usually you don't need to change this for local development
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Install Node.js Dependencies
**Run these commands in the `frontend` folder:**

```bash
# Install all required packages
npm install
```

#### Start Frontend Server
**Run this command in the `frontend` folder:**
```bash
npm run dev
```
✅ **Frontend will run on:** http://localhost:3000

## 🎯 You're Ready!

1. **Backend running:** http://localhost:8000
2. **Frontend running:** http://localhost:3000
3. **Visit:** http://localhost:3000 to use the app

## 🐳 Docker Deployment

### Option 1: Individual Containers (Development)

#### Build Images
```bash
# Backend
cd backend
docker build -t mistral_backend .

# Frontend  
cd ../frontend
docker build -t mistral_frontend .
```

#### Create Docker Network
```bash
# Create a network for container communication
docker network create mistral-network
```

#### Run Backend Container
```bash
# Run backend on the network
docker run -d --name mistral_backend_container --network mistral-network -p 8000:8000 mistral_backend
```

#### Update Frontend Environment
**Before running frontend, update `frontend/.env`:**
```env
# Change from localhost to backend container name
NEXT_PUBLIC_API_URL=http://mistral_backend_container:8000
```

#### Rebuild Frontend with Updated Environment
```bash
# Rebuild frontend with container-specific API URL
cd frontend
docker build -t mistral_frontend .
```

#### Run Frontend Container
```bash
# Run frontend on the same network
docker run -d --name mistral_frontend_container --network mistral-network -p 3000:3000 mistral_frontend
```

### Option 2: Docker Compose (Recommended)

**Create `docker-compose.yml` in project root:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    container_name: mistral_backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=True
      - ALLOWED_HOSTS=localhost,mistral_backend
      - CORS_ALLOWED_ORIGINS=http://localhost:3000,http://mistral_frontend:3000
    networks:
      - mistral-network

  frontend:
    build: ./frontend
    container_name: mistral_frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend
    networks:
      - mistral-network

networks:
  mistral-network:
    driver: bridge
```

**Run with Docker Compose:**
```bash
# Start both containers
docker-compose up -d

# Stop both containers
docker-compose down

# View logs
docker-compose logs -f
```

### Production Deployment Notes

**Update `backend/.env` for production:**
```env
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,backend-container-name
CORS_ALLOWED_ORIGINS=https://yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com
```

**Update `frontend/.env` for production:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 📁 Project Structure

```
MistralChat/
├── backend/
│   ├── authentication/         # User auth, verification, password reset
│   ├── messaging/             # Chat functionality with Mistral AI
│   ├── backend/              # Django settings and configuration
│   ├── .env.example          # Environment template
│   ├── requirements.txt      # Python dependencies
│   ├── manage.py            # Django management
│   └── dockerfile           # Backend Docker config
├── frontend/
│   ├── src/app/             # Next.js pages and layouts
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (auth)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # API client and utilities
│   ├── types/              # TypeScript type definitions
│   ├── .env_example        # Environment template
│   ├── package.json        # Node.js dependencies
│   └── dockerfile          # Frontend Docker config
└── README.md
```

## 🔐 Authentication Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

### Available Endpoints
- `POST /auth/signup/` - User registration
- `POST /auth/login/` - User login
- `POST /auth/verify-email/` - Email verification
- `POST /auth/send-reset-password-email/` - Request password reset
- `POST /auth/reset-password/` - Reset password with token

## 🛠️ Development Commands

### Backend
```bash
# Run development server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### Frontend
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## � Getting Your API Keys & Credentials

### Mistral AI API Key
1. **Visit:** https://mistral.ai/
2. **Sign up** for a free account
3. **Go to:** API Keys section in your dashboard
4. **Create** a new API key
5. **Copy** the key and paste it in `backend/.env` as `MISTRAL_API_KEY`

### Gmail App Password (for email features)
1. **Go to:** https://myaccount.google.com/
2. **Enable** 2-Factor Authentication first
3. **Go to:** Security → 2-Step Verification → App passwords
4. **Generate** an app password for "Mail"
5. **Copy** the 16-character password (not your regular Gmail password)
6. **Paste** it in `backend/.env` as `EMAIL_HOST_PASSWORD`

### Django Secret Key
**Run this command in Python to generate a secure key:**
```python
# Open Python terminal and run:
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```
**Copy** the output and paste it in `backend/.env` as `SECRET_KEY`

## �📧 Email Configuration

For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in `EMAIL_HOST_PASSWORD`

## 🔑 API Keys Setup

### Mistral AI API Key
1. Visit [Mistral AI](https://mistral.ai/)
2. Create account and get API key
3. Add to `MISTRAL_API_KEY` in backend `.env`

### Django Secret Key
Generate new secret key:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

## 🌐 Production Deployment

### Environment Variables
Update `CSRF_TRUSTED_ORIGINS` and `ALLOWED_HOSTS` for your domain:
```env
CSRF_TRUSTED_ORIGINS=https://yourdomain.com
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

### Security Settings
Enable production security in `backend/.env`:
```env
DEBUG=False
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### "Backend won't start" ❌
**Check these files and commands:**
1. **File:** `backend/.env` - Make sure it exists and has all required values
2. **Command:** `env\Scripts\activate` - Make sure virtual environment is activated
3. **Command:** `python manage.py migrate` - Run this in `backend` folder

#### "Frontend won't start" ❌
**Check these in the `frontend` folder:**
1. **Command:** `npm install` - Run this to install dependencies
2. **Command:** `rm -rf .next` then `npm run dev` - Clear build cache
3. **File:** `frontend/.env` - Make sure it exists

#### "Can't create account" ❌
**Check these settings:**
1. **File:** `backend/.env` - Verify `EMAIL_HOST_PASSWORD` is your Gmail app password
2. **File:** `backend/.env` - Make sure `CSRF_TRUSTED_ORIGINS=http://localhost:3000`
3. **Make sure:** Both backend (8000) and frontend (3000) servers are running

#### "Password not strong enough" ❌
**Your password must have:**
- At least 8 characters
- One uppercase letter (A-Z)
- One lowercase letter (a-z)  
- One number (0-9)
- One special character (!@#$%^&*)

#### "Can't connect to API" ❌
**Check these:**
1. **Backend server:** Must be running on http://localhost:8000
2. **File:** `frontend/.env` - Should have `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. **File:** `backend/.env` - Should have `CSRF_TRUSTED_ORIGINS=http://localhost:3000`

### Still Having Issues?
1. **Check** if both servers are running (backend on 8000, frontend on 3000)
2. **Restart** both servers (Ctrl+C then start again)
3. **Clear** browser cache or try incognito mode
4. **Check** all `.env` files have the correct values

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing issues for solutions
- Review troubleshooting section above