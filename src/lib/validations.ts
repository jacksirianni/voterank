import { z } from 'zod';

// ============================================================================
// CONTEST SCHEMAS
// ============================================================================

export const createContestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(5000, 'Description too long').optional(),
  contestType: z.enum(['POLL', 'ELECTION', 'SURVEY', 'RANKING']).default('POLL'),
  votingMethod: z.enum(['IRV', 'STV', 'BORDA', 'CONDORCET', 'APPROVAL', 'SCORE', 'STAR', 'PLURALITY']).default('IRV'),
  visibility: z.enum(['PUBLIC_LINK', 'ORGANIZER_ONLY', 'RESTRICTED_LIST', 'PRIVATE']).default('PUBLIC_LINK'),
  ballotStyle: z.enum(['DRAG', 'GRID']).default('DRAG'),
  timezone: z.string().default('UTC'),
  opensAt: z.string().datetime().optional().nullable(),
  closesAt: z.string().datetime().optional().nullable(),
  settings: z.object({
    allowPartialRanking: z.boolean().default(true),
    showLiveResults: z.boolean().default(false),
    maxRanks: z.number().min(1).max(100).optional(),
    tieBreakMethod: z.enum(['eliminate-all', 'previous-round', 'random']).default('eliminate-all'),
  }).default({}),
  deduplicationEnabled: z.boolean().default(false),
  requireVoterId: z.boolean().default(false),
});

export const updateContestSchema = createContestSchema.partial().extend({
  status: z.enum(['DRAFT', 'OPEN', 'PAUSED', 'CLOSED', 'ARCHIVED']).optional(),
});

// ============================================================================
// OPTION SCHEMAS
// ============================================================================

export const createOptionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  imageUrl: z.string().url().optional().nullable(),
  categoryId: z.string().optional().nullable(),
});

export const updateOptionSchema = createOptionSchema.partial().extend({
  active: z.boolean().optional(),
  sortOrder: z.number().min(0).optional(),
});

// ============================================================================
// CATEGORY SCHEMAS
// ============================================================================

export const createCategorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  sortOrder: z.number().min(0).default(0),
});

// ============================================================================
// BALLOT SCHEMAS
// ============================================================================

export const submitBallotSchema = z.object({
  ranking: z.array(z.string()).min(0, 'At least one choice required'),
  categoryId: z.string().optional().nullable(),
  voterId: z.string().max(200).optional(),
  voterName: z.string().max(200).optional(),
  voterEmail: z.string().email().optional(),
  deviceFingerprint: z.string().max(500).optional(),
});

// ============================================================================
// VOTER SCHEMAS
// ============================================================================

export const registerVoterSchema = z.object({
  voterId: z.string().min(1).max(200),
  name: z.string().max(200).optional(),
  email: z.string().email().optional(),
});

export const allowedVoterSchema = z.object({
  voterId: z.string().min(1).max(200),
  name: z.string().max(200).optional(),
  email: z.string().email().optional(),
});

export const bulkAllowedVotersSchema = z.object({
  voters: z.array(allowedVoterSchema).min(1).max(10000),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreateContestInput = z.infer<typeof createContestSchema>;
export type UpdateContestInput = z.infer<typeof updateContestSchema>;
export type CreateOptionInput = z.infer<typeof createOptionSchema>;
export type UpdateOptionInput = z.infer<typeof updateOptionSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type SubmitBallotInput = z.infer<typeof submitBallotSchema>;
export type RegisterVoterInput = z.infer<typeof registerVoterSchema>;
export type AllowedVoterInput = z.infer<typeof allowedVoterSchema>;
