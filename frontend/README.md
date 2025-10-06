# AI Chat App - Next.js Frontend

A modern AI chat application built with Next.js 15 and designed to work with a Django backend.

## 🏗️ Project Structure

```
my-app/
├── src/
│   └── app/                    # Next.js 15 App Router
│       ├── page.tsx           # Landing page (redirects authenticated users to /chat)
│       ├── layout.tsx         # Root layout with Navbar
│       ├── chat/              # Protected chat interface
│       │   └── page.tsx
│       ├── login/             # Login page
│       │   └── page.tsx
│       ├── register/          # User registration page
│       │   └── page.tsx
│       └── logout/            # Logout handling
│           └── page.tsx
├── components/                 # Reusable UI components
│   ├── ChatInput.tsx          # Message input with send button
│   ├── ChatMessage.tsx        # Individual message bubble
│   ├── ChatContainer.tsx      # Messages container with scrolling
│   ├── Navbar.tsx             # Navigation bar with auth state
│   └── Loader.tsx             # Loading indicator
├── hooks/                     # Custom React hooks
│   ├── useAuth.ts             # Authentication state management
│   └── useChat.ts             # Chat messages and API calls
├── lib/                       # Shared utilities and API wrappers
│   ├── api.ts                 # Django API client functions
│   └── auth.ts                # Token management utilities
├── types/                     # TypeScript type definitions
│   └── index.ts               # All app-wide types
├── middleware.ts              # Next.js middleware (route protection)
└── .env.local.example         # Environment variables template
```

## 🚀 Features

- **Authentication System**: Login, registration, and logout with JWT token management
- **Real-time Chat Interface**: Clean, responsive chat UI with message bubbles
- **Protected Routes**: Automatic redirection based on authentication status
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **TypeScript Support**: Full type safety throughout the application
- **Modern React Patterns**: Uses hooks, context, and modern React best practices

## 🛠️ Technologies

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: Custom hooks for state management
- **JWT Authentication**: Token-based authentication
- **Django API Integration**: RESTful API communication

## 📋 Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and set your Django API URL:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## 🔌 Django Backend Integration

This frontend expects a Django backend with the following API endpoints:

### Authentication Endpoints
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/auth/user/` - Get current user data
- `POST /api/auth/logout/` - User logout

### Chat Endpoints
- `POST /api/chat/` - Send message to AI and get response

### Expected API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

## 📱 User Flow

1. **Landing Page** (`/`): 
   - Shows app features and navigation
   - Auto-redirects authenticated users to chat

2. **Registration** (`/register`):
   - User creates new account
   - Redirects to login on success

3. **Login** (`/login`):
   - User signs in with email/password
   - Redirects to chat on success

4. **Chat** (`/chat`):
   - Protected route for authenticated users
   - Real-time AI chat interface
   - Message history and typing indicators

5. **Logout** (`/logout`):
   - Handles logout process
   - Redirects to home page

## 🔧 Key Components

### Custom Hooks

- **`useAuth`**: Manages authentication state, login/logout functions
- **`useChat`**: Handles chat messages, sending/receiving messages

### API Layer

- **`lib/api.ts`**: Centralized API communication with Django backend
- **`lib/auth.ts`**: JWT token management and localStorage utilities

### UI Components

- **`ChatContainer`**: Scrollable message display with auto-scroll
- **`ChatInput`**: Message composition with keyboard shortcuts
- **`ChatMessage`**: Individual message bubbles with timestamps
- **`Navbar`**: Navigation with authentication-aware menu

## 🔒 Authentication Flow

1. User logs in via `/login`
2. JWT token stored in localStorage
3. Token included in all API requests via Authorization header
4. `useAuth` hook manages global auth state
5. Protected routes redirect unauthenticated users to login

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Automatic dark mode detection
- **Custom Components**: Consistent design system

## 🚀 Deployment

This app can be deployed to:
- **Vercel**: Optimized for Next.js applications
- **Netlify**: Static site hosting with serverless functions
- **AWS**: S3 + CloudFront for static hosting
- **Docker**: Containerized deployment

Make sure to set the `NEXT_PUBLIC_API_BASE_URL` environment variable to point to your Django backend in production.
