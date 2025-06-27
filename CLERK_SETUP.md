# Clerk Authentication Setup

## Step 1: Create Clerk Application

1. Go to [https://clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose your preferred authentication methods (make sure to enable Google OAuth)

## Step 2: Get Your API Keys

From your Clerk dashboard, copy:
- Publishable Key (starts with `pk_test_` or `pk_live_`)
- Secret Key (starts with `sk_test_` or `sk_live_`)

## Step 3: Environment Variables

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here
DATABASE_URL=your_database_url_here
```

## Step 4: Configure OAuth

In your Clerk dashboard:
1. Go to "User & Authentication" -> "Social Connections"
2. Enable Google OAuth
3. Add your redirect URLs:
   - `http://localhost:3000`
   - `http://localhost:3000/auth/signin`
   - `http://localhost:3000/auth/signup`

## Step 5: Test Authentication

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Get Started Free" or "Sign In"
4. Test Google OAuth authentication

## Features Implemented

✅ Custom sign-in page (`/auth/signin`)
✅ Custom sign-up page (`/auth/signup`) 
✅ Google OAuth integration
✅ Protected dashboard routes
✅ User profile display in navbar
✅ Sign-out functionality
✅ Automatic redirects after authentication

## Files Created/Modified

- `middleware.ts` - Route protection
- `app/auth/signin/page.tsx` - Custom sign-in page
- `app/auth/signup/page.tsx` - Custom sign-up page
- `components/dashboard/dashboard-navbar.tsx` - User profile & sign-out
- `app/dashboard/page.tsx` - Protected dashboard
- `app/layout.tsx` - Clerk provider wrapper

The app now has a complete authentication system with custom UI that redirects to Clerk's hosted authentication for Google OAuth while maintaining your custom design. 