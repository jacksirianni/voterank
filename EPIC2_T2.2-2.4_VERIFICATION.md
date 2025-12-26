# EPIC 2 — T2.2, T2.3, T2.4 Create Flow Verification
**Status:** 🟡 PARTIAL IMPLEMENTATION
**Date:** 2025-12-25

---

## T2.2 — Create Wizard Step 2

### Required Fields (Per Spec):
- ✅ **Voting method**
- ✅ **Ballot style**
- ❌ **Winners count** (not in current implementation)

### Current Implementation

**Location:** Step 3 in current UI (should be Step 2 per spec)
**File:** `/src/app/create/page.tsx:247-404`

**Fields Actually Present:**

1. **Voting Method** ✅
   - Radio button group
   - Options: IRV (enabled), BORDA (disabled), APPROVAL (disabled)
   - Visual feedback (border highlight, background color)
   - Descriptions for each method
   - Default: IRV

2. **Ballot Style** ✅
   - Radio button group (2 options)
   - Options: DRAG (Drag & Drop), GRID (Number Grid)
   - Icons and descriptions
   - Default: DRAG

3. **Additional Settings** (not in spec):
   - Require Voter ID (checkbox)
   - Allow Partial Ranking (checkbox)

**Missing:**
- ❌ Winners count field (for multi-winner elections like STV)

---

### Acceptance Criteria Review

#### ❌ Invalid method combinations blocked
**FAIL** - Not implemented

**Current State:**
- No validation of method + ballot style combinations
- No validation of method + winners count
- All combinations allowed (IRV with any ballot style)
- No blocking logic

**Required State:**
- Block incompatible combinations, e.g.:
  - PLURALITY voting cannot use ranked ballots
  - Multi-winner methods (STV) require winnersCount > 1
  - Approval voting must use approval ballot (not ranking)

**Examples of Invalid Combinations:**
```typescript
// Invalid combinations to block:
- IRV + winnersCount > 1          // IRV is single-winner only
- STV + winnersCount === 1        // STV requires multiple winners
- PLURALITY + ballotStyle=DRAG    // Plurality doesn't use ranking
- APPROVAL + ballotStyle=DRAG     // Approval doesn't use ranking
- BORDA + winnersCount > 1        // Borda is typically single-winner
```

**Gap:**
- Need winnersCount field
- Need validation rules per method
- Need to display error messages when invalid
- Need to disable incompatible options

---

### Recommended Implementation

```tsx
{/* Winners Count (for multi-winner methods) */}
{votingMethod === 'STV' && (
  <div>
    <label>Number of Winners *</label>
    <input
      type="number"
      min="2"
      max={options.length}
      value={winnersCount}
      onChange={(e) => {
        const count = parseInt(e.target.value);
        setWinnersCount(count);
        validateWinnersCount(count);
      }}
    />
    {winnersCountError && (
      <p className="text-red-500 text-sm">{winnersCountError}</p>
    )}
    <p className="text-slate-500 text-xs">
      How many candidates should be elected?
    </p>
  </div>
)}

{/* Validation Logic */}
const validateMethodCombination = () => {
  // IRV must be single-winner
  if (votingMethod === 'IRV' && winnersCount > 1) {
    return {
      valid: false,
      error: 'IRV is a single-winner method. Use STV for multi-winner elections.'
    };
  }

  // STV requires multiple winners
  if (votingMethod === 'STV' && winnersCount < 2) {
    return {
      valid: false,
      error: 'STV requires at least 2 winners. Use IRV for single-winner.'
    };
  }

  // Plurality doesn't use ranking
  if (votingMethod === 'PLURALITY' && ballotStyle !== 'SIMPLE') {
    return {
      valid: false,
      error: 'Plurality voting uses simple ballots, not ranked choice.'
    };
  }

  return { valid: true, error: null };
};

{/* Display validation errors */}
{methodError && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
    <p className="text-red-700">{methodError}</p>
  </div>
)}
```

---

## T2.3 — Create Wizard Steps 3-5

### Required Inclusions (Per Spec):
- ✅ **Options** (partially implemented)
- ❌ **Categories** (not implemented)
- ❌ **Access control** (not implemented)

### Current Implementation

**Current Steps:**
- Step 1: Title + Description
- Step 2: Options
- Step 3: Settings (voting method, ballot style, etc.)

**Missing Steps:**
- Categories configuration
- Access control settings

---

### Step 3: Options ✅ (Currently Step 2)

**Location:** `/src/app/create/page.tsx:178-244`

**Implementation:**
```tsx
{step === 2 && (
  <div className="card p-6">
    <h1>Add Choices</h1>
    <p>Add at least 2 options for voters to rank.</p>

    {options.map((opt, idx) => (
      <div key={opt.tempId}>
        <div className="flex items-start gap-3">
          <div className="badge">{idx + 1}</div>
          <div className="flex-1">
            <input
              type="text"
              value={opt.name}
              onChange={(e) => updateOption(opt.tempId, 'name', e.target.value)}
              placeholder="Option name"
            />
            <input
              type="text"
              value={opt.description}
              onChange={(e) => updateOption(opt.tempId, 'description', e.target.value)}
              placeholder="Description (optional)"
            />
          </div>
          {options.length > 2 && (
            <button onClick={() => removeOption(opt.tempId)}>
              Remove
            </button>
          )}
        </div>
      </div>
    ))}

    <button onClick={addOption}>+ Add Option</button>

    <div className="flex justify-between">
      <button onClick={() => setStep(1)}>← Back</button>
      <button
        disabled={!canProceedStep2}
        onClick={() => setStep(3)}
      >
        Next: Settings →
      </button>
    </div>
  </div>
)}
```

**Validation:**
```tsx
const canProceedStep2 = options.filter(o => o.name.trim()).length >= 2;
```

**Features:**
- ✅ Add/remove options (minimum 2)
- ✅ Option name (required)
- ✅ Option description (optional)
- ✅ Validation (2+ options with names)
- ✅ Button disabled until valid

**Missing:**
- ❌ No category assignment
- ❌ No option reordering (drag-and-drop)
- ❌ No image upload per option
- ❌ No bulk import (CSV)

---

### Step 4: Categories ❌ (Not Implemented)

**Required:** Category management for multi-category contests

**Expected UI:**
```tsx
{/* Step 4: Categories (optional) */}
{step === 4 && (
  <div>
    <h1>Categories (Optional)</h1>
    <p>Organize options into categories for separate contests.</p>

    {/* Enable categories toggle */}
    <label>
      <input
        type="checkbox"
        checked={categoriesEnabled}
        onChange={(e) => setCategoriesEnabled(e.target.checked)}
      />
      <span>Use categories</span>
    </label>

    {categoriesEnabled && (
      <>
        {/* Category list */}
        {categories.map(cat => (
          <div key={cat.id}>
            <input
              value={cat.name}
              onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
              placeholder="Category name (e.g., Best Actor)"
            />
            <button onClick={() => removeCategory(cat.id)}>Remove</button>
          </div>
        ))}

        <button onClick={addCategory}>+ Add Category</button>

        {/* Assign options to categories */}
        <div>
          <h3>Assign Options</h3>
          {options.map(opt => (
            <div key={opt.tempId}>
              <span>{opt.name}</span>
              <select
                value={opt.categoryId}
                onChange={(e) => assignCategory(opt.tempId, e.target.value)}
              >
                <option value="">No category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </>
    )}

    <div className="flex justify-between">
      <button onClick={() => setStep(3)}>← Back</button>
      <button onClick={() => setStep(5)}>
        {categoriesEnabled ? 'Next: Access Control →' : 'Skip to Access Control →'}
      </button>
    </div>
  </div>
)}
```

**Database Support:**
- ✅ Category model exists (`/prisma/schema.prisma:195-215`)
- ✅ Option.categoryId field exists
- ✅ Contest.categories relation exists

**Status:** Schema supports categories, UI not implemented

---

### Step 5: Access Control ❌ (Not Implemented)

**Required:** Visibility and voter restrictions

**Expected UI:**
```tsx
{/* Step 5: Access Control */}
{step === 5 && (
  <div>
    <h1>Access Control</h1>
    <p>Who can vote in this contest?</p>

    {/* Visibility */}
    <div>
      <label>Visibility</label>
      <div className="space-y-2">
        {[
          {
            value: 'PUBLIC_LINK',
            label: 'Anyone with the link',
            desc: 'Public contest, no restrictions'
          },
          {
            value: 'RESTRICTED_LIST',
            label: 'Specific voter IDs only',
            desc: 'Only pre-approved voters can participate'
          },
          {
            value: 'ORGANIZER_ONLY',
            label: 'Testing mode',
            desc: 'Only you can vote (for testing)'
          },
        ].map(vis => (
          <label key={vis.value}>
            <input
              type="radio"
              name="visibility"
              value={vis.value}
              checked={visibility === vis.value}
              onChange={(e) => setVisibility(e.target.value)}
            />
            <div>
              <div>{vis.label}</div>
              <div className="text-sm text-slate-500">{vis.desc}</div>
            </div>
          </label>
        ))}
      </div>
    </div>

    {/* Allowed voters list (if RESTRICTED_LIST) */}
    {visibility === 'RESTRICTED_LIST' && (
      <div>
        <label>Allowed Voter IDs</label>
        <textarea
          placeholder="Enter voter IDs, one per line&#10;student123&#10;faculty@university.edu"
          value={allowedVoters}
          onChange={(e) => setAllowedVoters(e.target.value)}
        />
        <p className="text-sm text-slate-500">
          {allowedVoters.split('\n').filter(v => v.trim()).length} voters will be allowed
        </p>
      </div>
    )}

    {/* Require Voter ID */}
    <label>
      <input
        type="checkbox"
        checked={requireVoterId}
        onChange={(e) => setRequireVoterId(e.target.checked)}
      />
      <span>Require voter ID for all voters</span>
    </label>

    {/* Deduplication */}
    <label>
      <input
        type="checkbox"
        checked={deduplicationEnabled}
        onChange={(e) => setDeduplicationEnabled(e.target.checked)}
      />
      <span>Block duplicate votes from same device</span>
    </label>

    <div className="flex justify-between">
      <button onClick={() => setStep(4)}>← Back</button>
      <button onClick={() => setStep(6)}>Review & Publish →</button>
    </div>
  </div>
)}
```

**Current State:**
- ✅ Visibility defaults to PUBLIC_LINK
- ✅ requireVoterId checkbox exists (in Settings step)
- ❌ No UI to change visibility
- ❌ No allowed voters list UI
- ❌ No deduplication toggle in create flow

---

### Acceptance Criteria Review

#### ❌ Publish blocked until valid
**FAIL** - Partial implementation

**Current Validation:**
- ✅ Step 1: Title must be 3+ chars
- ✅ Step 2: Options must have 2+ items with names
- ❌ No validation on overall contest before publish
- ❌ No final review step

**Required Validation Before Publish:**

```typescript
const canPublish = () => {
  const errors: string[] = [];

  // Basic info
  if (!title || title.trim().length < 3) {
    errors.push('Title is required (min 3 characters)');
  }
  if (!slug || slug.length < 3) {
    errors.push('Slug is required (min 3 characters)');
  }
  if (!contestType) {
    errors.push('Contest type is required');
  }

  // Options
  const validOptions = options.filter(o => o.name.trim());
  if (validOptions.length < 2) {
    errors.push('At least 2 options are required');
  }

  // Categories (if enabled)
  if (categoriesEnabled) {
    const validCategories = categories.filter(c => c.name.trim());
    if (validCategories.length < 1) {
      errors.push('At least 1 category is required when categories are enabled');
    }

    // All options must be assigned to categories
    const unassigned = options.filter(o => !o.categoryId);
    if (unassigned.length > 0) {
      errors.push(`${unassigned.length} options are not assigned to a category`);
    }
  }

  // Voting method
  if (!votingMethod) {
    errors.push('Voting method is required');
  }

  // Method-specific validation
  if (votingMethod === 'STV' && !winnersCount) {
    errors.push('Winners count is required for STV');
  }
  if (votingMethod === 'STV' && winnersCount < 2) {
    errors.push('STV requires at least 2 winners');
  }
  if (votingMethod === 'IRV' && winnersCount > 1) {
    errors.push('IRV is single-winner only (use STV for multi-winner)');
  }

  // Access control
  if (visibility === 'RESTRICTED_LIST') {
    const voters = allowedVoters.split('\n').filter(v => v.trim());
    if (voters.length === 0) {
      errors.push('At least 1 allowed voter is required for restricted contests');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
```

---

## T2.4 — Publish Flow

### Required Outcomes (Per Spec):
- 🟡 **Contest created** (implemented)
- ❌ **Admin token generated** (not implemented)
- ✅ **Vote link generated** (implemented)

---

### Current Implementation

**Location:** `/src/app/create/page.tsx:46-94`

```typescript
const handleSubmit = async () => {
  setLoading(true);
  setError(null);

  try {
    // 1. Create contest
    const contestRes = await fetch('/api/contests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description: description || undefined,
        votingMethod,
        visibility,
        ballotStyle,
        requireVoterId,
        settings: {
          allowPartialRanking,
        },
      }),
    });

    if (!contestRes.ok) {
      const data = await contestRes.json();
      throw new Error(data.error || 'Failed to create contest');
    }

    const contest = await contestRes.json();

    // 2. Create options
    const validOptions = options.filter(o => o.name.trim());
    for (const opt of validOptions) {
      await fetch(`/api/contests/${contest.id}/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: opt.name,
          description: opt.description || undefined,
        }),
      });
    }

    // 3. Redirect to voting page
    router.push(`/vote/${contest.slug}`);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to create contest');
    setLoading(false);
  }
};
```

**What Works:**
- ✅ Creates contest via API
- ✅ Creates options via API (sequential requests)
- ✅ Redirects to vote page
- ✅ Vote link is the redirect URL

**What's Missing:**
- ❌ No admin token generated
- ❌ No success screen showing vote link + admin link
- ❌ No copy-to-clipboard functionality
- ❌ No email notification option
- ❌ Immediate redirect (user can't see links)

---

### Acceptance Criteria Review

#### 🟡 Contest created
**PARTIAL PASS** - Works but incomplete

**Current:**
- ✅ Contest created in database
- ✅ Options created
- ✅ Slug generated
- ❌ Categories not created (not implemented)
- ❌ Allowed voters not created (not implemented)

**Database Operations:**
```typescript
// Contest creation
POST /api/contests
→ Creates Contest record
→ Status: DRAFT
→ Slug: Auto-generated

// Option creation (loop)
POST /api/contests/{id}/options (× N)
→ Creates Option records
→ Linked to contest

// Missing:
POST /api/contests/{id}/categories (not implemented)
POST /api/contests/{id}/allowed-voters (not implemented)
```

#### ❌ Admin token generated
**FAIL** - Not implemented

**Current:**
- ❌ No admin token concept
- ❌ No authentication
- ❌ Contest management via URL (anyone with ID can manage)

**Required:**
```typescript
// Generate admin token on contest creation
const adminToken = crypto.randomBytes(32).toString('hex');

await prisma.contest.update({
  where: { id: contest.id },
  data: { adminToken },  // Add to schema
});

// Return admin URL
const adminUrl = `https://voterank.app/admin/${contest.id}?token=${adminToken}`;
```

**Use Case:**
- Vote link: Public (anyone can vote)
- Admin link: Secret (only organizer can manage)
- Current: Anyone with contest ID can manage (security issue)

#### ✅ Vote link generated
**PASS** - Working

**Implementation:**
```typescript
// Vote link
const voteUrl = `https://voterank.app/vote/${contest.slug}`;

// Current behavior: Redirects user to vote URL
router.push(`/vote/${contest.slug}`);
```

**Improvement Needed:**
```typescript
// Instead of redirect, show success screen
setPublished(true);
setVoteLink(`${window.location.origin}/vote/${contest.slug}`);
setAdminLink(`${window.location.origin}/admin/${contest.id}?token=${adminToken}`);
```

---

### Recommended Publish Flow

```tsx
{/* Final Step: Review & Publish */}
{step === 6 && !published && (
  <div>
    <h1>Review & Publish</h1>

    {/* Contest summary */}
    <div className="space-y-4">
      <div>
        <h3>Basic Info</h3>
        <p>Title: {title}</p>
        <p>Slug: {slug}</p>
        <p>Type: {contestType}</p>
      </div>

      <div>
        <h3>Voting</h3>
        <p>Method: {votingMethod}</p>
        <p>Ballot: {ballotStyle}</p>
        {winnersCount > 1 && <p>Winners: {winnersCount}</p>}
      </div>

      <div>
        <h3>Options</h3>
        <p>{options.filter(o => o.name.trim()).length} options</p>
        <ul>
          {options.filter(o => o.name.trim()).map(o => (
            <li key={o.tempId}>{o.name}</li>
          ))}
        </ul>
      </div>

      {categoriesEnabled && (
        <div>
          <h3>Categories</h3>
          <p>{categories.length} categories</p>
        </div>
      )}

      <div>
        <h3>Access</h3>
        <p>Visibility: {visibility}</p>
        {requireVoterId && <p>Voter ID required</p>}
      </div>
    </div>

    {/* Validation errors */}
    {publishErrors.length > 0 && (
      <div className="bg-red-50 p-4 rounded-xl">
        <h3 className="text-red-700 font-medium">Cannot publish:</h3>
        <ul className="text-red-600 text-sm">
          {publishErrors.map((err, i) => (
            <li key={i}>• {err}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Actions */}
    <div className="flex justify-between">
      <button onClick={() => setStep(5)}>← Back</button>
      <button
        onClick={handlePublish}
        disabled={publishErrors.length > 0 || loading}
        className="btn-primary"
      >
        {loading ? 'Publishing...' : 'Publish Contest'}
      </button>
    </div>
  </div>
)}

{/* Success Screen */}
{published && (
  <div>
    <div className="text-center mb-6">
      <div className="text-green-500 text-5xl mb-3">✓</div>
      <h1 className="text-2xl font-bold">Contest Published!</h1>
      <p className="text-slate-600">Your contest is ready for voters.</p>
    </div>

    {/* Vote link */}
    <div className="card p-4 mb-4">
      <label className="block text-sm font-medium mb-2">
        Vote Link (Share with voters)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={voteLink}
          readOnly
          className="input flex-1"
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(voteLink);
            toast.success('Copied!');
          }}
          className="btn-secondary"
        >
          Copy
        </button>
      </div>
    </div>

    {/* Admin link */}
    <div className="card p-4 mb-6">
      <label className="block text-sm font-medium mb-2">
        Admin Link (Keep secret!)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={adminLink}
          readOnly
          className="input flex-1"
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(adminLink);
            toast.success('Copied!');
          }}
          className="btn-secondary"
        >
          Copy
        </button>
      </div>
      <p className="text-sm text-amber-600 mt-2">
        ⚠️ Keep this link secret. Anyone with this link can manage your contest.
      </p>
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      <button
        onClick={() => router.push(voteLink)}
        className="btn-primary flex-1"
      >
        Go to Voting Page
      </button>
      <button
        onClick={() => router.push(adminLink)}
        className="btn-secondary flex-1"
      >
        Manage Contest
      </button>
    </div>
  </div>
)}
```

---

## Overall Implementation Status

### EPIC 2 Summary

| Task | Status | Completion |
|------|--------|------------|
| **T2.1** Step 1 (title, slug, type) | 🟡 PARTIAL | 33% |
| **T2.2** Step 2 (method, ballot, winners) | 🟡 PARTIAL | 66% |
| **T2.3** Steps 3-5 (options, categories, access) | 🟡 PARTIAL | 40% |
| **T2.4** Publish flow (creation, tokens, links) | 🟡 PARTIAL | 50% |
| **Overall EPIC 2** | 🟡 PARTIAL | ~45% |

---

### What Exists vs What's Needed

**Current Flow (3 steps):**
1. Title + Description
2. Options
3. Settings (method, ballot, voter ID, partial ranking)

**Required Flow (5-6 steps per spec):**
1. Title + Slug + Contest Type
2. Voting Method + Ballot Style + Winners Count
3. Options
4. Categories (optional)
5. Access Control (visibility, allowed voters, deduplication)
6. Review & Publish (with success screen)

---

### Critical Gaps

1. **T2.1 Missing:**
   - Slug input field
   - Contest type selector
   - Inline validation errors

2. **T2.2 Missing:**
   - Winners count field
   - Method combination validation
   - Error messages for invalid combos

3. **T2.3 Missing:**
   - Categories step (UI only, schema exists)
   - Access control step (visibility selector, allowed voters)
   - Final validation before publish

4. **T2.4 Missing:**
   - Admin token generation
   - Success screen with links
   - Copy-to-clipboard buttons
   - Proper publish flow (not immediate redirect)

---

### Estimated Work

| Task | Hours | Priority |
|------|-------|----------|
| Add slug + type to Step 1 | 3-4 | HIGH |
| Add inline validation | 4-6 | HIGH |
| Add winners count to Step 2 | 2-3 | MEDIUM |
| Add method validation | 3-4 | MEDIUM |
| Implement categories step | 6-8 | LOW |
| Implement access control step | 4-6 | MEDIUM |
| Add review step | 3-4 | MEDIUM |
| Implement publish success screen | 4-6 | HIGH |
| Add admin token system | 6-8 | HIGH |
| **Total** | **35-49 hours** | - |

---

## ✅ EPIC 2 STATUS: INCOMPLETE

**Verdict:** Create flow exists but is missing critical fields and steps per specification.

**Current State:** 🟡 PARTIAL (~45% complete)
- Basic wizard structure exists (3 steps)
- Core fields working (title, options, method, ballot)
- Missing many required fields and validation
- No categories or access control steps
- No proper publish flow

**MVP Recommendation:**
- Implement T2.1 and T2.4 first (slug, type, publish screen)
- Add inline validation
- Defer categories (T2.3) to post-MVP
- Add method validation (T2.2) for production readiness

---

**All EPIC 2 tasks documented.** Ready to review or move to next epic! 🚀
