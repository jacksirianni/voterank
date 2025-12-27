# Clerk Authentication Setup Guide

## Overview

Clerk authentication has been successfully integrated into VoteRank! Here's what's been implemented:

## What's Been Done

### 1. Package Installation
- Installed `@clerk/nextjs` for authentication
- Installed `svix` for webhook verification

### 2. Environment Variables
The following environment variables have been added to `.env.local` and `.env.example`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
CLERK_WEBHOOK_SECRET=your_webhook_secret_here
```

### 3. Database Schema
Updated Prisma schema with Clerk-compatible User model:
- `clerkId` field to link with Clerk users
- Removed NextAuth.js models (Account, Session, VerificationToken)
- Schema has been pushed to the database

### 4. Core Authentication Components

#### Root Layout (`src/app/layout.tsx`)
- Wrapped app with `ClerkProvider`

#### Header Component (`src/components/marketing/Header.tsx`)
- Sign In button (visible when logged out)
- User Button with avatar (visible when logged in)
- "My Contests" link (visible when logged in)

#### Middleware (`src/middleware.ts`)
- Protected routes: `/my-contests/*` and `/create/*`
- Automatically redirects to sign-in for unauthenticated users

#### Auth Helper (`src/lib/auth.ts`)
- `getCurrentUser()` function to get the current user from Clerk

### 5. User Sync Webhook
Created webhook handler at `/api/webhooks/clerk/route.ts` that:
- Creates user in database when they sign up
- Updates user when they update their profile
- Deletes user when they delete their account

### 6. Contest Creation
Updated contest creation API (`/api/contests/route.ts`):
- Automatically links contests to authenticated users
- Allows anonymous contest creation (ownerId will be null)

### 7. My Contests Dashboard
Built `/my-contests` page that:
- Shows all contests owned by the logged-in user
- Displays vote counts and contest details
- Links to vote page, results, and admin panel
- Protected route (requires authentication)

## Setup Instructions

### Step 1: Create Clerk Account
1. Go to https://clerk.com
2. Sign up for a free account
3. Create a new application

### Step 2: Get API Keys
1. In your Clerk dashboard, go to "API Keys"
2. Copy your Publishable Key and Secret Key
3. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

### Step 3: Configure Sign-in Methods
In Clerk dashboard:
1. Go to "User & Authentication" > "Email, Phone, Username"
2. Enable your preferred sign-in methods (Email recommended)
3. Enable "Email verification" for security

### Step 4: Set Up Webhook (Important!)
1. In Clerk dashboard, go to "Webhooks"
2. Click "Add Endpoint"
3. Set endpoint URL to: `https://your-domain.com/api/webhooks/clerk`
   - For local dev: Use ngrok or similar to expose localhost
4. Subscribe to these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the webhook signing secret
6. Update `.env.local`:
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

### Step 5: Test Authentication
1. Start the dev server: `npm run dev`
2. Click "Sign In" in the header
3. Create an account
4. Verify you see:
   - Your avatar in the header
   - "My Contests" link
   - Ability to create contests

### Step 6: Deploy to Production
When deploying to Vercel:
1. Add all Clerk environment variables in Vercel dashboard
2. Update webhook URL to production domain
3. Ensure webhook secret matches production webhook

## Features Implemented

### Authentication Flow
- Sign Up / Sign In via modal
- Email verification
- Password reset
- User profile management
- Sign Out

### User Dashboard
- View all your contests
- Quick access to voting page, results, and admin panel
- Empty state for new users

### Protected Routes
- `/create` - Requires authentication to create contests
- `/my-contests` - Requires authentication to view your contests

### Contest Ownership
- Authenticated users automatically own their contests
- Anonymous users can still create contests (ownerId = null)
- Users can only see their own contests in dashboard

## Migration & Portability

VoteRank is **NOT** locked into Clerk. The auth layer is thin and easily swappable:

### What stays in your database:
- All user data (email, name, profile)
- All contest data
- All voting data

### What Clerk provides:
- Authentication UI
- Session management
- Security (password hashing, 2FA, etc.)
- OAuth providers (Google, GitHub, etc.)

### To switch providers later:
1. Replace `getCurrentUser()` in `src/lib/auth.ts`
2. Update middleware in `src/middleware.ts`
3. Replace Header auth components
4. Remove webhook handler
5. Update database sync logic

Estimated migration time: 2-8 hours

## Troubleshooting

### "User not found" errors
- Make sure webhook is configured correctly
- Check webhook logs in Clerk dashboard
- Verify user was created in database after sign-up

### Infinite redirect loops
- Check middleware configuration
- Verify protected routes match
- Clear browser cookies and try again

### Webhook verification failures
- Verify webhook secret is correct
- Check webhook URL is accessible from internet
- Use ngrok for local development

## Next Steps

### Optional Enhancements:
1. **Email Invitations**: Send email invites to voters
2. **Team Workspaces**: Implement workspace features
3. **OAuth Providers**: Enable Google/GitHub sign-in
4. **User Settings**: Build user profile page
5. **2FA**: Enable two-factor authentication in Clerk

## Support

- Clerk Docs: https://clerk.com/docs
- VoteRank Issues: (your repo issues)
- Clerk Discord: https://clerk.com/discord
