import { createHash } from 'crypto';
import { customAlphabet } from 'nanoid';

// ============================================================================
// ID GENERATION
// ============================================================================

// URL-safe slug generator (lowercase letters and numbers)
const slugAlphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const generateSlug = customAlphabet(slugAlphabet, 10);

/**
 * Generate a unique, URL-friendly slug for contests
 */
export function createContestSlug(): string {
  return generateSlug();
}

/**
 * Generate a voter code
 */
export function createVoterCode(): string {
  return customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8)();
}

// ============================================================================
// HASHING
// ============================================================================

/**
 * Hash a string using SHA-256 (returns first 32 chars)
 */
export function hashString(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 32);
}

/**
 * Hash an IP address for privacy
 */
export function hashIP(ip: string): string {
  return hashString(`ip:${ip}`);
}

/**
 * Hash a device fingerprint
 */
export function hashDeviceFingerprint(fingerprint: string): string {
  return hashString(`fp:${fingerprint}`);
}

// ============================================================================
// DATE/TIME UTILITIES
// ============================================================================

/**
 * Check if a contest is currently open for voting
 */
export function isContestOpen(
  status: string,
  opensAt: Date | null,
  closesAt: Date | null
): boolean {
  if (status !== 'OPEN') return false;
  
  const now = new Date();
  
  if (opensAt && now < opensAt) return false;
  if (closesAt && now > closesAt) return false;
  
  return true;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, timezone = 'UTC'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date with time
 */
export function formatDateTime(date: Date | string, timezone = 'UTC'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

// ============================================================================
// CONTEST STATUS HELPERS
// ============================================================================

export function getContestStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: 'Draft',
    OPEN: 'Open',
    PAUSED: 'Paused',
    CLOSED: 'Closed',
    ARCHIVED: 'Archived',
  };
  return labels[status] || status;
}

export function getContestStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    OPEN: 'bg-green-100 text-green-700',
    PAUSED: 'bg-yellow-100 text-yellow-700',
    CLOSED: 'bg-blue-100 text-blue-700',
    ARCHIVED: 'bg-gray-100 text-gray-500',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

// ============================================================================
// VOTING METHOD HELPERS
// ============================================================================

export function getVotingMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    IRV: 'Ranked Choice (IRV)',
    STV: 'Single Transferable Vote',
    BORDA: 'Borda Count',
    CONDORCET: 'Condorcet',
    APPROVAL: 'Approval Voting',
    SCORE: 'Score Voting',
    STAR: 'STAR Voting',
    PLURALITY: 'Plurality',
  };
  return labels[method] || method;
}

export function getVotingMethodDescription(method: string): string {
  const descriptions: Record<string, string> = {
    IRV: 'Rank candidates in order of preference. The candidate with the fewest first-choice votes is eliminated each round until someone has a majority.',
    STV: 'Multi-winner version of ranked choice voting. Surplus votes and eliminated candidates have their votes transferred.',
    BORDA: 'Points are assigned based on ranking position. The candidate with the most points wins.',
    CONDORCET: 'The winner is the candidate who would beat every other candidate in a one-on-one matchup.',
    APPROVAL: 'Vote for as many candidates as you approve of. The candidate with the most approvals wins.',
    SCORE: 'Give each candidate a score. The candidate with the highest average score wins.',
    STAR: 'Score Then Automatic Runoff. Score candidates, then the top two have an automatic runoff.',
    PLURALITY: 'Vote for one candidate. The candidate with the most votes wins.',
  };
  return descriptions[method] || '';
}

// ============================================================================
// RATE LIMITING (Simple in-memory)
// ============================================================================

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetAt) {
    // New window
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }
  
  record.count++;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

// ============================================================================
// ERROR HELPERS
// ============================================================================

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function createErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }
  
  if (error instanceof Error) {
    return {
      error: error.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    };
  }
  
  return {
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  };
}
