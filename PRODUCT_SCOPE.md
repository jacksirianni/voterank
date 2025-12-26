# VoteRank — Product Contract & Scope Lock
**Epic 0 — T0.1 Lock sitemap and scope**
**Status:** 🔒 LOCKED
**Last Updated:** 2025-12-25

---

## 🎯 MVP Scope Definition

This document defines the **minimum viable product (MVP)** for VoteRank. Any features not explicitly marked as MVP are considered **post-MVP** and should not be implemented until the MVP is complete and validated.

---

## ✅ T0.1.1 — MVP Voting Methods

### ✅ INCLUDED IN MVP
**Instant Runoff Voting (IRV) ONLY**
- Single-winner ranked choice voting
- Round-by-round elimination of lowest candidates
- Vote transfers to next choice until winner has majority
- Exhausted ballot handling (no remaining choices)
- Tie-breaking method: eliminate all tied candidates

**Implementation Status:** ✅ FULLY IMPLEMENTED
- Engine: `/src/lib/tabulation/engines/irv.ts`
- UI: Create page shows IRV as only enabled option
- Results: Full round-by-round breakdown with vote transfers

### ❌ EXCLUDED FROM MVP (Post-Launch)
- **Borda Count** - Points-based scoring system
- **Single Transferable Vote (STV)** - Multi-winner IRV variant
- **Condorcet** - Head-to-head comparison method
- **Approval Voting** - Select all acceptable candidates
- **Plurality** - Simple first-past-the-post

**Decision Rationale:**
- IRV is the most well-known ranked voting method
- Reduces complexity for initial users
- Allows focused testing of core ranking UX
- Other methods add minimal user value in MVP phase

**Future Consideration:**
- Add voting methods based on user demand
- Potential priority order: Approval → Borda → STV → Condorcet

---

## ✅ T0.1.2 — MVP Organizer Permissions

### Authentication & User Accounts
**MVP Status:** ❌ NO AUTHENTICATION IN MVP

**What This Means:**
- No login/signup required
- No user accounts
- No password management
- No session handling
- No protected routes

**How Contests Are Managed:**
- Contests are created anonymously
- Anyone with the contest ID/slug can access the dashboard management page
- Security through obscurity (long random IDs)
- Browser localStorage for device fingerprinting only

**Database Schema Status:**
- User, Workspace, and WorkspaceMember models exist in schema
- These models are NOT USED in MVP
- Kept in schema for future migration path only

### Organizer Capabilities (Without Auth)

**✅ MVP Organizer Actions (No Login Required):**

1. **Create Contest**
   - Set title, description
   - Add 2+ options with descriptions
   - Choose ballot style (Drag or Grid)
   - Toggle voter ID requirement
   - Toggle partial ranking allowance
   - Auto-generates unique slug

2. **Manage Contest** (via `/dashboard/contest/[id]`)
   - View contest stats (votes, options, method)
   - Change contest status (Draft → Open → Closed)
   - Edit title and description
   - Add/remove options
   - Copy vote link
   - Preview voting page
   - View results
   - Delete contest

3. **View Dashboard** (via `/dashboard`)
   - See all contests (no filtering by owner)
   - Filter by status (Draft/Open/Closed)
   - View aggregate stats

**❌ NOT IN MVP:**
- User authentication/authorization
- Contest ownership verification
- Permission levels (owner/admin/member/viewer)
- Workspace/team functionality
- Contest sharing with specific users
- Access control beyond URL obscurity
- Edit history/audit logs
- Role-based access control (RBAC)

**Security Model for MVP:**
- Contests use long random IDs (cuid) - computationally infeasible to guess
- Management URLs like `/dashboard/contest/abc123xyz` are secret links
- No API authentication required
- Rate limiting on voting endpoints (10 votes/minute per IP)
- Device fingerprinting to detect duplicate votes

**Post-MVP Authentication Plan:**
- Add optional user accounts
- Migrate existing contests to anonymous "legacy" owner
- Add contest ownership and permissions
- Implement workspace/team features
- Add SSO/OAuth options

---

## ✅ T0.1.3 — Results Visibility Rules

### MVP Results Access Control

**✅ IMPLEMENTED RULES:**

1. **Draft Contests**
   - Results endpoint returns 403 error
   - Message: "Results are not available for draft contests"
   - Voting page shows "This contest is not yet open for voting"
   - No results button visible

2. **Open Contests**
   - Results are PUBLIC and always visible
   - Anyone with the link can view results
   - Results update in real-time as votes come in
   - Cached results with refresh option (`?refresh=true`)
   - Voting page shows "View Results" button

3. **Closed Contests**
   - Results are PUBLIC and always visible
   - Results are considered final
   - Voting page redirects to results page
   - Cached results served by default

**Implementation Details:**
- Results endpoint: `GET /api/contests/[id]/results`
- Results page: `/vote/[slug]/results`
- Caching: Results cached in `ResultSnapshot` table
- Force refresh: Query param `?refresh=true` recalculates

**❌ NOT IN MVP:**
- Results visibility toggle (hide results until closed)
- Scheduled results reveal
- Private results (organizer-only viewing)
- Results preview for organizers only
- Partial results hiding (e.g., only show winner)
- Results access passwords
- Time-delayed results publication

**Database Field (Not Used in MVP):**
- `Contest.settings.showLiveResults` exists but is ignored
- Always treated as `true` in MVP
- Code comment: "For now, always show results (add auth checks later)"

**Future Considerations:**
- Add `showLiveResults` boolean to create form
- Implement organizer-only results preview
- Add "Results will be visible when contest closes" message
- Consider delayed results reveal for competitive elections

---

## ✅ T0.1.4 — Screen-by-Screen MVP Status

### Legend
- ✅ **MVP** - Must be implemented and working for launch
- 🟡 **MVP-PARTIAL** - Partially implemented, some features missing
- ❌ **POST-MVP** - Not needed for initial launch
- 🏗️ **IN PROGRESS** - Currently being built
- ⚠️ **BLOCKED** - Waiting on dependencies

---

### 1. Homepage (/)
**Status:** ✅ MVP
**Route:** `/src/app/page.tsx`

**MVP Features:**
- ✅ Hero section with branding
- ✅ "Create Contest" CTA → `/create`
- ✅ "Dashboard" navigation
- ✅ Features section explaining how it works
- ✅ Educational content about ranked choice voting
- ✅ Demo link to example contest
- ✅ Footer with disclaimer

**Post-MVP Features:**
- ❌ User login/signup buttons
- ❌ Testimonials section
- ❌ Pricing information
- ❌ Blog/resources section
- ❌ Video explainer
- ❌ Interactive demo voting widget

**Notes:**
- Uses system fonts (Google Fonts removed due to timeout)
- Brand gradient (indigo/violet) implemented
- VoteRank logo and assets in `/public/`

---

### 2. Create Contest (/create)
**Status:** ✅ MVP
**Route:** `/src/app/create/page.tsx`

**MVP Features:**
- ✅ Multi-step wizard (3 steps with progress indicator)
- ✅ Step 1: Basic info (title, description)
- ✅ Step 2: Add options (min 2, with descriptions)
- ✅ Step 3: Settings (voting method, ballot style, voter ID, partial ranking)
- ✅ Contest preview/summary
- ✅ Form validation
- ✅ Error handling
- ✅ Redirect to `/vote/{slug}` on success

**Post-MVP Features:**
- ❌ Visibility settings UI (currently defaults to PUBLIC_LINK)
- ❌ Voting method selection (Borda, Approval, etc.)
- ❌ Category creation (multi-category contests)
- ❌ Custom branding upload (logo, colors)
- ❌ Schedule voting window (opensAt, closesAt)
- ❌ Advanced settings (tie-breaking, vote weighting)
- ❌ Template contests
- ❌ Duplicate existing contest
- ❌ Import options from CSV

**Notes:**
- IRV is only enabled voting method
- Ballot style: Drag & Drop or Grid
- Visibility defaults to PUBLIC_LINK
- requireVoterId checkbox controls voter authentication
- allowPartialRanking checkbox (default: true)

---

### 3. Dashboard (/dashboard)
**Status:** 🟡 MVP-PARTIAL
**Route:** `/src/app/dashboard/page.tsx`

**MVP Features:**
- ✅ List all contests (no user filtering)
- ✅ Status filter (All/Draft/Open/Closed)
- ✅ Stats cards (total contests, active, drafts, votes)
- ✅ Contest cards with title, status, vote count, date
- ✅ Click contest → `/dashboard/contest/[id]`
- ✅ "New Contest" button → `/create`
- ✅ Empty states
- ✅ Loading states

**Post-MVP Features:**
- ❌ User authentication (show only my contests)
- ❌ Search/filter by title
- ❌ Sort options (date, votes, alphabetical)
- ❌ Archive contests
- ❌ Bulk actions (delete multiple, export all)
- ❌ Contest templates
- ❌ Recently viewed section
- ❌ Workspace/team filtering

**Known Issues:**
- Shows ALL contests from database (no ownership filter)
- No pagination (will break with many contests)

**Notes:**
- Uses contest status badges (Draft/Open/Closed)
- Voting method badge shown
- Created date displayed

---

### 4. Contest Management (/dashboard/contest/[id])
**Status:** ✅ MVP
**Route:** `/src/app/dashboard/contest/[id]/page.tsx`

**MVP Features:**
- ✅ 3 tabs: Overview, Options, Settings
- ✅ **Overview Tab:**
  - ✅ Status controls (Draft/Open/Closed)
  - ✅ Edit title and description
  - ✅ Quick stats display
  - ✅ Vote link with copy button
- ✅ **Options Tab:**
  - ✅ Add new options
  - ✅ Delete options (with confirmation)
  - ✅ View option list
- ✅ **Settings Tab:**
  - ✅ View read-only settings
  - ✅ Delete contest (danger zone)
- ✅ Header actions (Copy Link, Preview, Results)
- ✅ Back to dashboard navigation

**Post-MVP Features:**
- ❌ Edit voting method (locked after creation)
- ❌ Edit ballot style (locked after creation)
- ❌ Edit visibility settings
- ❌ Reorder options (drag-and-drop)
- ❌ Disable/enable options (without deleting)
- ❌ Add option images
- ❌ Bulk import options
- ❌ Export contest configuration
- ❌ Clone contest
- ❌ Schedule voting window
- ❌ Advanced settings panel
- ❌ Voter list management (for RESTRICTED_LIST)
- ❌ Audit log/history
- ❌ Share with collaborators
- ❌ Embed code generator

**Notes:**
- Status changes take effect immediately
- Deleting contest requires confirmation
- No validation on status changes (can close contest with 0 votes)
- Settings are read-only after creation (except title/description)

---

### 5. Voting Page (/vote/[slug])
**Status:** ✅ MVP
**Route:** `/src/app/vote/[slug]/page.tsx`

**MVP Features:**
- ✅ Multi-stage flow (Loading → Voter ID → Voting → Success/Error)
- ✅ **Voter ID Stage** (if requireVoterId = true):
  - ✅ Voter ID input (required)
  - ✅ Name input (optional)
  - ✅ Email input (optional)
  - ✅ Validation against allowedVoters (if RESTRICTED_LIST)
- ✅ **Voting Stage:**
  - ✅ Two ballot styles (Drag & Drop / Grid)
  - ✅ Ranking visualization
  - ✅ Partial ranking support
  - ✅ Clear all / reset
  - ✅ Real-time validation
- ✅ **Ballot Variants:**
  - ✅ Drag & Drop: Drag candidates between "Your Ranking" and "Unranked"
  - ✅ Grid: Click cells to assign ranks (table format)
- ✅ **Success Stage:**
  - ✅ Confirmation message
  - ✅ "View Results" button
  - ✅ "Back to Home" button
- ✅ **Closed State:**
  - ✅ Draft message
  - ✅ Closed message
  - ✅ View results button (if applicable)
- ✅ Device fingerprinting (duplicate detection)
- ✅ Error handling and display
- ✅ Disclaimer text

**Post-MVP Features:**
- ❌ Multi-category navigation with progress bar
- ❌ Save draft ballot (resume later)
- ❌ Voter authentication (login)
- ❌ Ranked choice explanation/tutorial overlay
- ❌ Candidate comparison view
- ❌ Weighted voting
- ❌ Write-in candidates
- ❌ Ballot receipt/confirmation code
- ❌ Social sharing after voting
- ❌ Live vote count (while voting)

**Notes:**
- Device fingerprint stored in localStorage
- Rate limiting: 10 votes/minute per IP
- Duplicate votes marked as SUSPECTED_DUPLICATE
- No vote editing (once submitted, final)
- Single-category only in MVP

---

### 6. Results Page (/vote/[slug]/results)
**Status:** ✅ MVP
**Route:** `/src/app/vote/[slug]/results/page.tsx`

**MVP Features:**
- ✅ Winner announcement (gradient card)
- ✅ Summary stats (votes, rounds, exhausted)
- ✅ Final rankings list (1st/2nd/3rd badges)
- ✅ Round-by-round breakdown (accordion)
- ✅ **Each Round Shows:**
  - ✅ Vote tallies with percentages
  - ✅ Progress bars
  - ✅ Eliminated candidates (strikethrough)
  - ✅ Vote transfers
  - ✅ Exhausted ballots count
- ✅ "How It Works" educational section
- ✅ Results timestamp
- ✅ Loading states
- ✅ Error states
- ✅ Empty state (no votes yet)

**Post-MVP Features:**
- ❌ Category tabs (multi-category support)
- ❌ Export results (PDF, CSV, JSON)
- ❌ Share results (social media, embed)
- ❌ Print-friendly view
- ❌ Visual charts/graphs (bar chart, sankey diagram)
- ❌ Comparison with other voting methods
- ❌ Detailed voter analytics
- ❌ Individual ballot lookup
- ❌ Results animations
- ❌ Historical snapshots comparison
- ❌ Filter by demographic (if captured)

**Notes:**
- Results are cached in ResultSnapshot table
- Use `?refresh=true` to force recalculation
- Shows vote transfers between rounds
- Exhausted ballots explained
- IRV algorithm implementation only

---

### 7. Not Found (404)
**Status:** ❌ POST-MVP
**Route:** `/src/app/not-found.tsx` (does NOT exist)

**Current Behavior:**
- Default Next.js 404 page
- Generic error message

**Post-MVP Features:**
- Custom 404 page design
- Search functionality
- Links to popular contests
- "Create Contest" CTA

---

### 8. Error Page (500)
**Status:** ❌ POST-MVP
**Route:** `/src/app/error.tsx` (does NOT exist)

**Current Behavior:**
- Default Next.js error page
- Generic error message

**Post-MVP Features:**
- Custom error page design
- Error reporting
- Support contact info

---

### 9. Authentication Pages
**Status:** ❌ POST-MVP
**Routes:** Not created

**Post-MVP Pages:**
- `/login` - User login
- `/signup` - User registration
- `/forgot-password` - Password reset
- `/verify-email` - Email verification
- `/profile` - User profile settings

---

### 10. Legal/Info Pages
**Status:** ❌ POST-MVP
**Routes:** Not created

**Post-MVP Pages:**
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/about` - About VoteRank
- `/contact` - Contact form
- `/faq` - Frequently asked questions
- `/docs` - Documentation

---

## 📊 Implementation Status Summary

### ✅ Fully Implemented (6 pages)
1. Homepage (/)
2. Create Contest (/create)
3. Dashboard (/dashboard) *
4. Contest Management (/dashboard/contest/[id])
5. Voting Page (/vote/[slug])
6. Results Page (/vote/[slug]/results)

*Dashboard shows all contests (no user filtering)

### ❌ Not in MVP (13+ pages)
- Authentication pages (login, signup, profile)
- Error pages (404, 500, error boundary)
- Legal pages (terms, privacy, about, contact, FAQ, docs)
- Additional voting method pages
- Analytics/reporting dashboard
- Admin panel

---

## 🔐 Security Model

### MVP Security Approach
- **No authentication** - Contests managed via secret URLs
- **Security through obscurity** - Long random IDs (cuid)
- **Rate limiting** - 10 votes/minute per IP address
- **Duplicate detection** - Device fingerprinting
- **Input validation** - Zod schemas on all inputs
- **CORS** - API routes accept all origins (public voting)
- **XSS prevention** - React auto-escaping
- **SQL injection prevention** - Prisma ORM parameterized queries

### Known Security Limitations (Acceptable for MVP)
- ⚠️ Anyone with contest ID can manage contest
- ⚠️ No ownership verification
- ⚠️ No audit log of changes
- ⚠️ Dashboard shows all contests (data leak)
- ⚠️ Device fingerprinting can be bypassed
- ⚠️ No CAPTCHA (vulnerable to bots)
- ⚠️ Results always public (no privacy)

### Post-MVP Security Enhancements
- User authentication and authorization
- Contest ownership and permissions
- IP-based access restrictions
- CAPTCHA integration
- Vote encryption
- Results privacy controls
- Audit logging
- Two-factor authentication
- API rate limiting per user
- DDoS protection

---

## 🚀 Launch Criteria

### Definition of "MVP Complete"
All of the following must be true:

**Functional Requirements:**
- ✅ Users can create contests with 2+ options
- ✅ Users can share vote links
- ✅ Voters can rank candidates (drag or grid)
- ✅ Votes are recorded in database
- ✅ IRV algorithm calculates correct winner
- ✅ Results display round-by-round breakdown
- ✅ Contest status can be changed (Draft/Open/Closed)
- ✅ Dashboard shows all contests
- ✅ All 6 MVP pages working

**Quality Requirements:**
- ✅ No ESLint errors
- ✅ No TypeScript compilation errors
- ✅ No console errors on any page
- ⚠️ Responsive design (mobile-friendly) - needs testing
- ⚠️ Accessibility (WCAG AA) - needs testing
- ⚠️ Cross-browser compatibility - needs testing
- ❌ Unit tests (not implemented)
- ❌ E2E tests (not implemented)

**Deployment Requirements:**
- ✅ Deployed to Vercel
- ✅ Production database (Neon PostgreSQL)
- ✅ Environment variables configured
- ✅ Custom domain (optional)
- ⚠️ Error monitoring - needs setup
- ❌ Analytics - not implemented

**Documentation Requirements:**
- ✅ Product scope locked (this document)
- ✅ API endpoints documented (in code)
- ✅ Wireframe map created
- ❌ User guide - not created
- ❌ API documentation - not created

---

## 📝 Change Control Process

### Making Changes to This Document
This document is **LOCKED** as of the date above. Changes require explicit approval.

**To request a scope change:**
1. Create a GitHub issue with label `scope-change`
2. Describe the proposed change and rationale
3. Explain impact on timeline and existing features
4. Get approval before implementing
5. Update this document with new lock date

**Emergency scope reductions (allowed):**
- Removing features to meet deadline
- Fixing critical bugs
- Addressing security vulnerabilities
- Complying with legal requirements

**Prohibited scope changes (not allowed without approval):**
- Adding new voting methods
- Adding authentication
- Adding new pages
- Changing data models
- Adding external integrations

---

## ✅ Acceptance Criteria

### T0.1 Lock sitemap and scope

- ✅ **Confirm MVP voting methods** - IRV only, documented above
- ✅ **Confirm MVP organizer permissions** - No auth, URL-based access
- ✅ **Confirm results visibility rules** - Always public, documented above
- ✅ **Label every screen MVP vs later** - All 6 screens labeled with status

### Done When
- ✅ Sitemap page marked locked (this document)
- ✅ MVP explicitly documented (all sections complete)
- ✅ No feature ambiguity remains (all questions answered)

---

## 🎯 Next Epic

With Epic 0 complete, proceed to:
- **Epic 1** - Implementation (if specified in your checklist)
- **Epic 2** - Testing & QA
- **Epic 3** - Deployment & Launch

---

**Document Owner:** VoteRank Team
**Status:** 🔒 LOCKED
**Version:** 1.0
**Lock Date:** 2025-12-25
