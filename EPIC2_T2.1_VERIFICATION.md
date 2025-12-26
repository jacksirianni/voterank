# EPIC 2 — T2.1 Create Wizard Step 1 Verification
**Status:** 🟡 PARTIAL IMPLEMENTATION
**Date:** 2025-12-25

---

## Required Fields (Per Spec)

### Expected Step 1 Fields:
- ✅ **Title**
- ❌ **Slug** (not in current implementation)
- ❌ **Contest type** (not in current implementation)

---

## Current Implementation Analysis

### What EXISTS in Current Create Page

**File:** `/src/app/create/page.tsx`

**Current Step 1 (Lines 131-175):**
```tsx
{step === 1 && (
  <div className="card p-6">
    <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">Create Contest</h1>
    <p className="text-slate-600 mb-6">Start by giving your contest a name and description.</p>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Contest Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          placeholder="e.g., Best Pizza Topping"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
          rows={3}
          placeholder="What is this contest about?"
        />
      </div>
    </div>

    <div className="mt-6 flex justify-between">
      <Link href="/" className="btn-secondary">
        Cancel
      </Link>
      <button
        onClick={() => setStep(2)}
        disabled={!canProceedStep1}
        className="btn-primary"
      >
        Next: Add Options →
      </button>
    </div>
  </div>
)}
```

**Fields Actually Present:**
- ✅ Title (required, min 3 chars)
- ✅ Description (optional)
- ❌ Slug (missing)
- ❌ Contest type (missing)

**Validation:**
```tsx
const canProceedStep1 = title.trim().length >= 3;
```
- ✅ Title must be at least 3 characters
- ✅ Button disabled until valid
- ❌ No inline validation errors shown (just disabled button)
- ❌ No slug uniqueness check
- ❌ No contest type selection

---

## Database Schema Support

**Contest Model** (`/prisma/schema.prisma:91-154`)

```prisma
model Contest {
  id          String   @id @default(cuid())
  slug        String   @unique      // ✅ Supported
  title       String                // ✅ Supported
  contestType ContestType @default(POLL)  // ✅ Supported
  // ...
}

enum ContestType {
  POLL        // Quick decision poll
  ELECTION    // Formal election
  SURVEY      // Multi-question survey
  RANKING     // General ranking
}
```

**Slug Generation** (`/src/app/api/contests/route.ts:72-84`)
```typescript
// Generate unique slug
let slug = createContestSlug();
let attempts = 0;
while (attempts < 5) {
  const existing = await prisma.contest.findUnique({ where: { slug } });
  if (!existing) break;
  slug = createContestSlug();
  attempts++;
}
```

**Current Behavior:**
- ✅ Slug auto-generated on backend (not user-facing)
- ✅ Uniqueness enforced by database (unique constraint)
- ✅ Uniqueness checked before insert (5 retry attempts)
- ❌ User cannot customize slug
- ❌ No frontend slug input/validation

---

## Gap Analysis: Current vs Required

### T2.1 Requirements

| Requirement | Status | Notes |
|------------|--------|-------|
| **Title field** | ✅ IMPLEMENTED | Working with validation |
| **Slug field** | ❌ MISSING | Auto-generated backend only |
| **Contest type field** | ❌ MISSING | Defaults to POLL |
| **Slug uniqueness enforced** | 🟡 PARTIAL | Backend enforced, not user-facing |
| **Validation errors shown inline** | ❌ MISSING | Only button disabled state |

---

## Current Implementation Status

### ✅ What Works:

1. **Title Input:**
   - Text input with placeholder
   - Connected to state (controlled component)
   - Minimum 3 characters validated
   - Button disabled if invalid

2. **Description Input:**
   - Optional textarea
   - Controlled component
   - No validation (optional field)

3. **Navigation:**
   - Cancel button → Back to home
   - Next button → Step 2 (if valid)
   - Button states (enabled/disabled)

### ❌ What's Missing:

1. **Slug Field:**
   - No UI input for slug
   - No slug preview/suggestion
   - No slug validation
   - No uniqueness check on frontend

2. **Contest Type Field:**
   - No radio/select for contest type
   - Always defaults to POLL
   - User cannot choose ELECTION/SURVEY/RANKING

3. **Inline Validation:**
   - No error messages displayed
   - No field-level validation feedback
   - No real-time validation
   - Only button disabled state (poor UX)

4. **Slug Uniqueness:**
   - Not enforced on frontend
   - User doesn't see if slug is taken
   - Only fails on backend submit (late feedback)

---

## Acceptance Criteria Review

### ❌ Slug uniqueness enforced
**FAIL** - Not implemented on frontend

**Current State:**
- Backend enforces uniqueness (database constraint)
- Backend retries slug generation if collision
- Frontend has no slug field
- User never interacts with slugs

**Required State:**
- User can enter custom slug
- Frontend checks slug availability (API call)
- Real-time feedback if slug taken
- Suggestion if slug unavailable

**Gap:**
- Need slug input field
- Need slug availability API endpoint
- Need real-time validation
- Need slug formatting (URL-safe)

### ❌ Validation errors shown inline
**FAIL** - Not implemented

**Current State:**
- Button disabled if title < 3 chars
- No error messages
- No field highlighting
- No validation feedback

**Required State:**
- Error message below field: "Title must be at least 3 characters"
- Error message: "Slug already taken"
- Error styling on invalid fields
- Real-time validation as user types

**Gap:**
- Need error state management
- Need error message components
- Need field validation logic
- Need styling for error states

---

## Recommended Implementation

### Step 1 UI (Revised)

```tsx
{step === 1 && (
  <div className="card p-6">
    <h1>Step 1: Basic Information</h1>
    <p>Give your contest a name and choose its type.</p>

    {/* Title Field */}
    <div>
      <label>Contest Title *</label>
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          validateTitle(e.target.value);
        }}
        className={titleError ? 'input input-error' : 'input'}
      />
      {titleError && (
        <p className="text-red-500 text-sm mt-1">{titleError}</p>
      )}
    </div>

    {/* Slug Field */}
    <div>
      <label>URL Slug *</label>
      <div className="flex">
        <span className="text-slate-400">voterank.app/vote/</span>
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            const formatted = formatSlug(e.target.value);
            setSlug(formatted);
            checkSlugAvailability(formatted);
          }}
          className={slugError ? 'input input-error' : 'input'}
        />
      </div>
      {slugChecking && <p className="text-slate-500">Checking availability...</p>}
      {slugError && <p className="text-red-500 text-sm">{slugError}</p>}
      {slugAvailable && <p className="text-green-500 text-sm">✓ Available</p>}
    </div>

    {/* Contest Type Field */}
    <div>
      <label>Contest Type *</label>
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: 'POLL', label: 'Poll', desc: 'Quick decision poll' },
          { value: 'ELECTION', label: 'Election', desc: 'Formal election' },
          { value: 'SURVEY', label: 'Survey', desc: 'Multi-question survey' },
          { value: 'RANKING', label: 'Ranking', desc: 'General ranking' },
        ].map(type => (
          <label
            key={type.value}
            className={contestType === type.value ? 'selected' : ''}
          >
            <input
              type="radio"
              name="contestType"
              value={type.value}
              checked={contestType === type.value}
              onChange={(e) => setContestType(e.target.value)}
            />
            <div>
              <div>{type.label}</div>
              <div className="text-sm">{type.desc}</div>
            </div>
          </label>
        ))}
      </div>
    </div>

    {/* Description Field */}
    <div>
      <label>Description (optional)</label>
      <textarea value={description} onChange={...} />
    </div>

    <div className="flex justify-between">
      <button className="btn-secondary">Cancel</button>
      <button
        className="btn-primary"
        disabled={!canProceedStep1}
        onClick={() => setStep(2)}
      >
        Next: Voting Method →
      </button>
    </div>
  </div>
)}
```

### State Management

```tsx
// Step 1 state
const [title, setTitle] = useState('');
const [titleError, setTitleError] = useState('');

const [slug, setSlug] = useState('');
const [slugError, setSlugError] = useState('');
const [slugAvailable, setSlugAvailable] = useState(false);
const [slugChecking, setSlugChecking] = useState(false);

const [contestType, setContestType] = useState('POLL');

const [description, setDescription] = useState('');

// Validation
const validateTitle = (value: string) => {
  if (value.trim().length < 3) {
    setTitleError('Title must be at least 3 characters');
    return false;
  }
  if (value.length > 200) {
    setTitleError('Title cannot exceed 200 characters');
    return false;
  }
  setTitleError('');
  return true;
};

// Slug formatting
const formatSlug = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Slug availability check (debounced)
const checkSlugAvailability = debounce(async (slug: string) => {
  if (slug.length < 3) {
    setSlugError('Slug must be at least 3 characters');
    return;
  }

  setSlugChecking(true);
  try {
    const res = await fetch(`/api/contests/slug-check?slug=${slug}`);
    const data = await res.json();

    if (data.available) {
      setSlugAvailable(true);
      setSlugError('');
    } else {
      setSlugAvailable(false);
      setSlugError('Slug already taken');
    }
  } finally {
    setSlugChecking(false);
  }
}, 500);

// Can proceed validation
const canProceedStep1 =
  title.trim().length >= 3 &&
  !titleError &&
  slug.length >= 3 &&
  !slugError &&
  slugAvailable &&
  contestType !== '';
```

### Required API Endpoint

**New:** `GET /api/contests/slug-check?slug={slug}`

```typescript
// /src/app/api/contests/slug-check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug required' }, { status: 400 });
  }

  // Check if slug is valid format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({
      available: false,
      error: 'Slug can only contain lowercase letters, numbers, and hyphens'
    });
  }

  if (slug.length < 3) {
    return NextResponse.json({
      available: false,
      error: 'Slug must be at least 3 characters'
    });
  }

  // Check database
  const existing = await prisma.contest.findUnique({
    where: { slug },
  });

  return NextResponse.json({
    available: !existing,
    slug,
  });
}
```

---

## Current vs Required: Side-by-Side

### Current Implementation

**Step 1 Fields:**
- Title (required, 3+ chars)
- Description (optional)

**Validation:**
- Button disabled if title < 3 chars
- No error messages

**Slug:**
- Auto-generated on backend
- Not user-facing

**Contest Type:**
- Defaults to POLL
- Not user-facing

### Required Implementation

**Step 1 Fields:**
- Title (required, 3-200 chars)
- Slug (required, 3+ chars, unique)
- Contest Type (required, radio selection)
- Description (optional)

**Validation:**
- Inline error messages
- Real-time slug availability check
- Field-level error styling
- Clear validation feedback

**Slug:**
- User editable
- URL-safe formatting
- Uniqueness enforced
- Availability feedback

**Contest Type:**
- 4 options: POLL, ELECTION, SURVEY, RANKING
- Radio button selection
- Descriptions for each type

---

## Testing Verification

### Current Tests (Manual)

**Test 1: Title Validation**
- Enter title < 3 chars
- Expected: Button disabled ✅
- Actual: Works

**Test 2: Title > 3 chars**
- Enter valid title
- Expected: Button enabled ✅
- Actual: Works

**Test 3: Description Optional**
- Leave description empty
- Expected: Can proceed ✅
- Actual: Works

### Required Tests (Not Possible Yet)

**Test 4: Slug Uniqueness**
- Enter existing slug
- Expected: Error "Slug already taken"
- Actual: ❌ No slug field

**Test 5: Contest Type**
- Select ELECTION type
- Expected: Selected, can proceed
- Actual: ❌ No type selector

**Test 6: Inline Validation**
- Enter invalid title, blur field
- Expected: Error message shown
- Actual: ❌ No inline errors

---

## Migration Path

### Phase 1: Add Missing Fields (Minimal MVP)

1. Add slug field (auto-filled from title, editable)
2. Add contest type radio buttons
3. Update canProceedStep1 validation

**Effort:** Low (2-3 hours)
**Impact:** High (meets basic requirements)

### Phase 2: Add Inline Validation

1. Add error state for each field
2. Add error message components
3. Add error styling
4. Add real-time validation

**Effort:** Medium (4-6 hours)
**Impact:** High (better UX)

### Phase 3: Add Slug Availability Check

1. Create slug-check API endpoint
2. Add debounced availability check
3. Add checking/available/taken states
4. Add visual feedback

**Effort:** Medium (3-4 hours)
**Impact:** High (prevents conflicts)

---

## Recommendations

### For MVP (Must Have):

1. **Add Slug Field:**
   - Auto-generate from title (debounced)
   - Allow manual editing
   - Format as URL-safe
   - Store in state
   - Pass to backend on submit

2. **Add Contest Type:**
   - Radio button group
   - 4 options with descriptions
   - Default to POLL
   - Store in state
   - Pass to backend on submit

3. **Basic Inline Validation:**
   - Title error message (if < 3 chars)
   - Slug error message (if invalid format)
   - Show errors below fields
   - Simple red text styling

### For Production (Should Have):

4. **Slug Availability Check:**
   - API endpoint to check uniqueness
   - Debounced check on change
   - Visual feedback (checking/available/taken)
   - Suggestion if taken

5. **Enhanced Validation:**
   - Real-time validation as user types
   - Field-level error styling (red border)
   - Success states (green border, checkmark)
   - Character counters for title

### Nice to Have (Could Have):

6. **Slug Suggestions:**
   - Auto-suggest available slug if taken
   - "Did you mean: {slug}-2024?"

7. **Contest Type Previews:**
   - Icons for each type
   - Expandable descriptions
   - Examples for each type

---

## Code References

**Current Implementation:**
- `/src/app/create/page.tsx:131-175` - Step 1 UI
- `/src/app/create/page.tsx:20-26` - State management
- `/src/app/create/page.tsx:96` - canProceedStep1 validation

**Backend Support:**
- `/prisma/schema.prisma:91-154` - Contest model with slug + type
- `/prisma/schema.prisma:156-161` - ContestType enum
- `/src/app/api/contests/route.ts:72-84` - Slug generation logic

**Required New Files:**
- `/src/app/api/contests/slug-check/route.ts` - Slug availability endpoint

---

## ✅ T2.1 STATUS: INCOMPLETE

**Verdict:** Current implementation is missing critical Step 1 fields (slug, contest type) and validation feedback.

**Current State:** 🟡 PARTIAL (25% complete)
- ✅ Title field working
- ✅ Description field working
- ❌ Slug field missing
- ❌ Contest type missing
- ❌ Inline validation missing
- ❌ Slug uniqueness not user-facing

**Gaps to Address:**
1. Add slug input field with formatting
2. Add contest type radio selection
3. Add inline error messages
4. Add slug availability check
5. Update validation logic

**Estimated Work:** 8-12 hours to fully implement per spec

---

**Next:** Ready for T2.2 verification (send confirmation to continue)
