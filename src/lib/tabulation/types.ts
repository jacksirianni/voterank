// ============================================================================
// TABULATION ENGINE TYPES
// ============================================================================

/**
 * A ballot as stored in the database
 */
export interface StoredBallot {
  id: string;
  ranking: string[]; // Array of option IDs in rank order
  status: 'VALID' | 'SUSPECTED_DUPLICATE' | 'DEDUPED_IGNORED' | 'REMOVED' | 'INVALID';
}

/**
 * An option/candidate in the contest
 */
export interface TabulationOption {
  id: string;
  name: string;
  active: boolean;
}

/**
 * Settings for tabulation
 */
export interface TabulationSettings {
  // IRV-specific
  allowPartialRanking?: boolean;
  tieBreakMethod?: 'eliminate-all' | 'previous-round' | 'random';
  randomSeed?: string;
  
  // Multi-winner (STV) - future
  seatsToFill?: number;
  
  // Score/STAR - future
  maxScore?: number;
  
  // General
  excludeDuplicates?: boolean;
  excludeRemoved?: boolean;
}

/**
 * Validation result for a single ballot
 */
export interface BallotValidationResult {
  ballotId: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Full validation report
 */
export interface ValidationReport {
  valid: boolean;
  totalBallots: number;
  validBallots: number;
  invalidBallots: number;
  ballotResults: BallotValidationResult[];
  summary: {
    duplicateRankings: number;
    unknownOptions: number;
    emptyBallots: number;
  };
}

/**
 * Vote tally for a single option in a round
 */
export interface OptionTally {
  optionId: string;
  optionName: string;
  votes: number;
  percentage: number;
  status: 'active' | 'eliminated' | 'elected';
}

/**
 * Transfer record showing where votes moved
 */
export interface VoteTransfer {
  fromOptionId: string;
  fromOptionName: string;
  toOptionId: string | null; // null = exhausted
  toOptionName: string | null;
  count: number;
}

/**
 * A single round of IRV tabulation
 */
export interface IRVRound {
  roundNumber: number;
  tallies: OptionTally[];
  
  // What happened this round
  eliminated: Array<{ optionId: string; optionName: string; votes: number }>;
  elected: Array<{ optionId: string; optionName: string; votes: number }> | null;
  
  // Vote movements
  transfers: VoteTransfer[];
  
  // Counts
  activeBallots: number;
  exhaustedBallots: number;
  totalExhausted: number; // Cumulative
  
  // Majority threshold for this round
  majorityThreshold: number;
  
  // Any notes about tie-breaking or special handling
  notes: string[];
}

/**
 * Summary of the final result
 */
export interface TabulationSummary {
  winner: {
    optionId: string;
    optionName: string;
    finalVotes: number;
    finalPercentage: number;
  } | null;
  
  isTie: boolean;
  tiedOptions?: Array<{ optionId: string; optionName: string; votes: number }>;
  
  totalBallots: number;
  validBallots: number;
  exhaustedBallots: number;
  exhaustedPercentage: number;
  
  roundsCount: number;
  
  // Rankings at end
  finalRankings: Array<{
    rank: number;
    optionId: string;
    optionName: string;
    eliminatedInRound: number | null;
    finalVotes: number;
  }>;
}

/**
 * Complete tabulation result
 */
export interface TabulationResult {
  method: string;
  methodDisplayName: string;
  
  // Did tabulation succeed?
  success: boolean;
  error?: string;
  
  // Results
  rounds: IRVRound[];
  summary: TabulationSummary;
  
  // Metadata
  computedAt: Date;
  computeTimeMs: number;
  
  // For verification
  integrity: {
    ballotCount: number;
    optionCount: number;
    ballotsHash: string;
  };
}

/**
 * Interface for pluggable tabulation engines
 */
export interface TabulationEngine {
  id: string;
  displayName: string;
  description: string;
  supportsMultiWinner: boolean;
  
  /**
   * Validate ballots before tabulation
   */
  validateBallots(
    ballots: StoredBallot[],
    options: TabulationOption[],
    settings: TabulationSettings
  ): ValidationReport;
  
  /**
   * Run the tabulation and return results
   */
  tabulate(
    ballots: StoredBallot[],
    options: TabulationOption[],
    settings: TabulationSettings
  ): TabulationResult;
}
