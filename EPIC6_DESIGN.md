# EPIC 6 — Organizer With Auth - Design Document

## Overview
Add proper authentication system while maintaining backwards compatibility with existing token-based admin links. Users can sign up, log in, and manage all their contests from a unified dashboard.

## Architecture Decisions

### Authentication Provider: NextAuth.js v5 (Auth.js)
- **Email Magic Links**: Primary authentication method (passwordless)
- **OAuth Providers**: Google, GitHub for social login
- **Session Strategy**: JWT-based sessions for scalability
- **Email Provider**: Resend for magic link emails

### Database Schema Updates

#### User Table (Already exists)
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  contests      Contest[]  @relation("UserContests")
  memberships   WorkspaceMember[]
}
```

#### New Tables for Auth
```prisma
model Account {
  // OAuth accounts (Google, GitHub, etc.)
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

#### Workspace/Team Support
```prisma
model Workspace {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  members     WorkspaceMember[]
  contests    Contest[]
}

model WorkspaceMember {
  id          String   @id @default(cuid())
  workspaceId String
  userId      String
  role        WorkspaceRole @default(MEMBER)
  createdAt   DateTime @default(now())

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
}

enum WorkspaceRole {
  OWNER
  ADMIN
  MEMBER
}
```

#### Contest Updates
```prisma
model Contest {
  // Add workspace support
  workspaceId String?
  workspace   Workspace? @relation(fields: [workspaceId], references: [id])

  // Existing ownerId becomes the creator when using workspace
  // When no workspace, ownerId is the individual owner
}
```

## User Flows

### Flow 1: New User Signup
1. User visits `/login` or `/signup`
2. Enters email address
3. Receives magic link email
4. Clicks link → redirected to `/auth/callback`
5. Session created → redirected to `/dashboard`
6. First-time user sees empty dashboard with "Create Contest" CTA

### Flow 2: Existing User Login
1. User visits `/login`
2. Enters email
3. Receives magic link
4. Clicks link → authenticated → `/dashboard`
5. Sees list of their contests

### Flow 3: OAuth Login
1. User clicks "Continue with Google" or "Continue with GitHub"
2. Redirected to OAuth provider
3. Approves → redirected to `/auth/callback`
4. Session created → `/dashboard`

### Flow 4: Creating Contest (Authenticated)
1. From dashboard, clicks "Create Contest"
2. Goes through create wizard (same as current `/create`)
3. Contest automatically associated with logged-in user
4. Redirected to dashboard, contest appears in list
5. Admin token link still generated for sharing/backup access

### Flow 5: Migrating Token-Based Contest
1. User with existing contests via admin tokens
2. Logs in to dashboard
3. Dashboard shows "Link Existing Contest" option
4. Enters admin token
5. Contest ownership transferred to user account

## Pages & Routes

### Authentication Pages

#### A0: Login `/login`
**Features:**
- Email input for magic link
- OAuth buttons (Google, GitHub)
- Link to signup (same page, different copy)
- Error handling for invalid emails

**UI:**
```
┌─────────────────────────────┐
│     VoteRank Logo           │
│                             │
│  Sign in to your account    │
│                             │
│  [Email input            ]  │
│  [Send magic link button ]  │
│                             │
│  ─── or continue with ───   │
│                             │
│  [Google button]            │
│  [GitHub button]            │
│                             │
│  Don't have an account?     │
│  Sign up (same flow)        │
└─────────────────────────────┘
```

#### A1: Signup `/signup`
- Redirect to `/login` (same form, different messaging)
- "Create your account" instead of "Sign in"

#### A2: Magic Link Sent `/auth/check-email`
**Features:**
- Confirmation that email was sent
- Instructions to check inbox
- Resend link option (with cooldown)

#### A3: OAuth Callback `/auth/callback`
**Features:**
- Loading spinner
- Auto-redirect after auth
- Error handling

### Dashboard Pages

#### D0: Dashboard `/dashboard`
**Features:**
- List of user's contests (grid or table)
- Create new contest button
- Filter/search contests
- Quick stats (total contests, total votes)
- Link existing contest option

**UI:**
```
┌────────────────────────────────────────┐
│  VoteRank     [Profile ▼] [Settings]  │
├────────────────────────────────────────┤
│  My Contests                           │
│  [+ New Contest]  [Link Existing]      │
│                                        │
│  ┌─────────────────┐ ┌──────────────┐ │
│  │ Contest Title   │ │ Contest 2    │ │
│  │ 42 votes        │ │ 18 votes     │ │
│  │ Active          │ │ Draft        │ │
│  │ [Manage] [View] │ │ [Edit]       │ │
│  └─────────────────┘ └──────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

#### D1: Contest Detail `/dashboard/contest/[id]`
- Same as current organizer dashboard (O8-O17 screens)
- Tabs: Overview, Options, Votes, Audit, Settings
- Accessible if user owns the contest OR has valid admin token

#### D2: Create Contest `/dashboard/create`
- Same wizard as current `/create` page
- Auto-associates contest with logged-in user
- Still generates admin token for backwards compatibility

#### D3: Workspace Switcher (Component)
**Features:**
- Dropdown in header
- Switch between personal and team workspaces
- Create new workspace option

#### D4: Team Members `/dashboard/team` (Future)
**Features:**
- List workspace members
- Invite by email
- Manage roles (Owner, Admin, Member)
- Remove members

#### D5: Profile Settings `/dashboard/settings`
**Features:**
- Update name, email
- Connected accounts (OAuth)
- Delete account option

## Security Considerations

### Token-Based Access (Backwards Compatible)
- Existing admin token system continues to work
- Anyone with admin token can access contest
- No auth required for token-based access

### Authenticated Access
- User must be logged in
- User must own the contest OR be workspace member
- Middleware protects `/dashboard/*` routes

### Mixed Mode Support
- Contest can be accessed via:
  1. User authentication (owns contest)
  2. Workspace membership
  3. Admin token URL parameter
- Priority: User auth > Workspace > Admin token

## Implementation Plan

### Phase 1: Core Auth Setup
1. Install NextAuth.js and dependencies
2. Create auth schema migrations
3. Configure NextAuth with email + OAuth
4. Create login/signup pages
5. Add session middleware

### Phase 2: Dashboard
1. Create dashboard layout
2. Build contest list page
3. Update contest creation to associate with user
4. Add contest detail auth checks

### Phase 3: Migration Tools
1. Link existing contests flow
2. Bulk import via admin tokens
3. Email notification for linked contests

### Phase 4: Teams (Future)
1. Workspace creation
2. Member invitations
3. Role-based permissions
4. Workspace switcher

## Environment Variables

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-random-secret-here

# OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email Provider (Resend)
RESEND_API_KEY=
EMAIL_FROM=noreply@voterank.app
```

## Migration Strategy

### For Existing Users
1. **No Disruption**: Admin token links continue working
2. **Optional Migration**: Dashboard banner shows "Sign up to manage all contests"
3. **Easy Linking**: Enter admin token to claim contest
4. **Batch Import**: Support importing multiple contests at once

### Database Migration
1. Add new auth tables (Account, Session, VerificationToken)
2. Add Workspace tables (optional, can be later)
3. Update Contest to support workspaceId
4. Backfill existing contests with ownerId if missing

## Success Metrics
- Users can sign up and log in successfully
- Contests created while authenticated auto-link to user
- Admin token access still works for existing contests
- Dashboard shows all user's contests
- Migration tool successfully links existing contests

## Future Enhancements
- Team workspaces with role-based access
- Contest templates
- Analytics dashboard
- Billing/subscription management
- API keys for programmatic access
