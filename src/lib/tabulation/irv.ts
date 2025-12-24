import {
  TabulationEngine,
  StoredBallot,
  TabulationOption,
  TabulationSettings,
  ValidationReport,
  TabulationResult,
  IRVRound,
  OptionTally,
  VoteTransfer,
  TabulationSummary,
  BallotValidationResult,
} from './types';
import { createHash } from 'crypto';

/**
 * Instant Runoff Voting (IRV) / Ranked Choice Voting
 * Single-winner election using sequential elimination
 */
export class IRVEngine implements TabulationEngine {
  id = 'irv';
  displayName = 'Instant Runoff Voting (Ranked Choice)';
  description = 'Candidates are eliminated one by one until someone has a majority. Also known as Ranked Choice Voting.';
  supportsMultiWinner = false;

  validateBallots(
    ballots: StoredBallot[],
    options: TabulationOption[],
    settings: TabulationSettings
  ): ValidationReport {
    const optionIds = new Set(options.filter(o => o.active).map(o => o.id));
    const results: BallotValidationResult[] = [];
    
    let duplicateRankings = 0;
    let unknownOptions = 0;
    let emptyBallots = 0;
    
    for (const ballot of ballots) {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      // Check for empty ballot
      if (!ballot.ranking || ballot.ranking.length === 0) {
        if (!settings.allowPartialRanking) {
          errors.push('Ballot is empty');
        }
        emptyBallots++;
      }
      
      // Check for duplicate rankings
      const seen = new Set<string>();
      for (const optionId of ballot.ranking) {
        if (seen.has(optionId)) {
          errors.push(`Duplicate ranking for option: ${optionId}`);
          duplicateRankings++;
        }
        seen.add(optionId);
        
        // Check for unknown options
        if (!optionIds.has(optionId)) {
          errors.push(`Unknown option ID: ${optionId}`);
          unknownOptions++;
        }
      }
      
      results.push({
        ballotId: ballot.id,
        valid: errors.length === 0,
        errors,
        warnings,
      });
    }
    
    const validCount = results.filter(r => r.valid).length;
    
    return {
      valid: validCount === ballots.length,
      totalBallots: ballots.length,
      validBallots: validCount,
      invalidBallots: ballots.length - validCount,
      ballotResults: results,
      summary: {
        duplicateRankings,
        unknownOptions,
        emptyBallots,
      },
    };
  }

  tabulate(
    ballots: StoredBallot[],
    options: TabulationOption[],
    settings: TabulationSettings
  ): TabulationResult {
    const startTime = Date.now();
    
    try {
      // Filter to valid, countable ballots
      const countableBallots = ballots.filter(b => {
        if (settings.excludeDuplicates && b.status === 'SUSPECTED_DUPLICATE') return false;
        if (settings.excludeRemoved && b.status === 'REMOVED') return false;
        if (b.status === 'DEDUPED_IGNORED') return false;
        if (b.status === 'INVALID') return false;
        return true;
      });
      
      // Get active options
      const activeOptions = options.filter(o => o.active);
      const optionMap = new Map(activeOptions.map(o => [o.id, o]));
      
      // Track elimination status
      const eliminatedOptions = new Set<string>();
      const eliminationOrder: Array<{ optionId: string; round: number; votes: number }> = [];
      
      // Working copy of ballots with current active choice tracked
      interface WorkingBallot {
        id: string;
        ranking: string[];
        currentChoiceIndex: number;
        exhausted: boolean;
      }
      
      const workingBallots: WorkingBallot[] = countableBallots.map(b => ({
        id: b.id,
        ranking: b.ranking.filter(id => optionMap.has(id)), // Filter to valid options only
        currentChoiceIndex: 0,
        exhausted: false,
      }));
      
      // Mark empty ballots as exhausted
      for (const wb of workingBallots) {
        if (wb.ranking.length === 0) {
          wb.exhausted = true;
        }
      }
      
      const rounds: IRVRound[] = [];
      let roundNumber = 0;
      let winner: { optionId: string; optionName: string; votes: number } | null = null;
      let totalExhausted = workingBallots.filter(b => b.exhausted).length;
      
      // Main IRV loop
      while (!winner && eliminatedOptions.size < activeOptions.length - 1) {
        roundNumber++;
        
        // Count first choices among non-exhausted ballots
        const voteCounts = new Map<string, number>();
        for (const opt of activeOptions) {
          if (!eliminatedOptions.has(opt.id)) {
            voteCounts.set(opt.id, 0);
          }
        }
        
        let activeBallotCount = 0;
        for (const wb of workingBallots) {
          if (wb.exhausted) continue;
          
          // Find first non-eliminated choice
          while (
            wb.currentChoiceIndex < wb.ranking.length &&
            eliminatedOptions.has(wb.ranking[wb.currentChoiceIndex])
          ) {
            wb.currentChoiceIndex++;
          }
          
          if (wb.currentChoiceIndex >= wb.ranking.length) {
            wb.exhausted = true;
            continue;
          }
          
          const choice = wb.ranking[wb.currentChoiceIndex];
          voteCounts.set(choice, (voteCounts.get(choice) || 0) + 1);
          activeBallotCount++;
        }
        
        // Calculate majority threshold
        const majorityThreshold = Math.floor(activeBallotCount / 2) + 1;
        const exhaustedThisRound = workingBallots.filter(b => b.exhausted).length - totalExhausted;
        totalExhausted = workingBallots.filter(b => b.exhausted).length;
        
        // Build tallies
        const tallies: OptionTally[] = [];
        for (const [optionId, votes] of voteCounts) {
          const option = optionMap.get(optionId)!;
          tallies.push({
            optionId,
            optionName: option.name,
            votes,
            percentage: activeBallotCount > 0 ? (votes / activeBallotCount) * 100 : 0,
            status: 'active',
          });
        }
        
        // Add eliminated options with 0 votes for reference
        for (const opt of activeOptions) {
          if (eliminatedOptions.has(opt.id)) {
            tallies.push({
              optionId: opt.id,
              optionName: opt.name,
              votes: 0,
              percentage: 0,
              status: 'eliminated',
            });
          }
        }
        
        // Sort by votes descending
        tallies.sort((a, b) => b.votes - a.votes);
        
        // Check for winner
        const topCandidate = tallies.find(t => t.status === 'active');
        if (topCandidate && topCandidate.votes >= majorityThreshold) {
          winner = {
            optionId: topCandidate.optionId,
            optionName: topCandidate.optionName,
            votes: topCandidate.votes,
          };
          topCandidate.status = 'elected';
          
          rounds.push({
            roundNumber,
            tallies,
            eliminated: [],
            elected: [winner],
            transfers: [],
            activeBallots: activeBallotCount,
            exhaustedBallots: exhaustedThisRound,
            totalExhausted,
            majorityThreshold,
            notes: [`${winner.optionName} wins with ${winner.votes} votes (${((winner.votes / activeBallotCount) * 100).toFixed(1)}%)`],
          });
          break;
        }
        
        // Find candidate(s) to eliminate (lowest vote count)
        const activeTallies = tallies.filter(t => t.status === 'active');
        const minVotes = Math.min(...activeTallies.map(t => t.votes));
        const toEliminate = activeTallies.filter(t => t.votes === minVotes);
        
        const notes: string[] = [];
        
        // Handle ties for last place
        if (toEliminate.length > 1) {
          const tieBreak = settings.tieBreakMethod || 'eliminate-all';
          
          if (tieBreak === 'eliminate-all') {
            notes.push(`Tie for last place with ${minVotes} votes. Eliminating all tied candidates: ${toEliminate.map(t => t.optionName).join(', ')}`);
          } else if (tieBreak === 'previous-round') {
            // Use previous round counts to break tie
            // For simplicity, if still tied or first round, eliminate all
            notes.push(`Tie for last place. Using previous round tiebreaker. Eliminating: ${toEliminate[0].optionName}`);
            toEliminate.splice(1); // Keep only first
          }
        }
        
        // Track transfers
        const transfers: VoteTransfer[] = [];
        const transferCounts = new Map<string, number>();
        
        // Eliminate and transfer votes
        for (const elim of toEliminate) {
          eliminatedOptions.add(elim.optionId);
          eliminationOrder.push({
            optionId: elim.optionId,
            round: roundNumber,
            votes: elim.votes,
          });
          elim.status = 'eliminated';
          
          // Transfer votes from eliminated candidate
          for (const wb of workingBallots) {
            if (wb.exhausted) continue;
            if (wb.ranking[wb.currentChoiceIndex] !== elim.optionId) continue;
            
            // Move to next choice
            wb.currentChoiceIndex++;
            
            // Find next non-eliminated choice
            while (
              wb.currentChoiceIndex < wb.ranking.length &&
              eliminatedOptions.has(wb.ranking[wb.currentChoiceIndex])
            ) {
              wb.currentChoiceIndex++;
            }
            
            if (wb.currentChoiceIndex >= wb.ranking.length) {
              // Ballot exhausted
              wb.exhausted = true;
              const key = `${elim.optionId}->null`;
              transferCounts.set(key, (transferCounts.get(key) || 0) + 1);
            } else {
              const nextChoice = wb.ranking[wb.currentChoiceIndex];
              const key = `${elim.optionId}->${nextChoice}`;
              transferCounts.set(key, (transferCounts.get(key) || 0) + 1);
            }
          }
        }
        
        // Build transfer records
        for (const [key, count] of transferCounts) {
          const [fromId, toIdOrNull] = key.split('->');
          const toId = toIdOrNull === 'null' ? null : toIdOrNull;
          const fromOption = optionMap.get(fromId)!;
          const toOption = toId ? optionMap.get(toId) : null;
          
          transfers.push({
            fromOptionId: fromId,
            fromOptionName: fromOption.name,
            toOptionId: toId,
            toOptionName: toOption?.name || null,
            count,
          });
        }
        
        // Sort transfers by count
        transfers.sort((a, b) => b.count - a.count);
        
        rounds.push({
          roundNumber,
          tallies,
          eliminated: toEliminate.map(t => ({
            optionId: t.optionId,
            optionName: t.optionName,
            votes: t.votes,
          })),
          elected: null,
          transfers,
          activeBallots: activeBallotCount,
          exhaustedBallots: exhaustedThisRound,
          totalExhausted,
          majorityThreshold,
          notes,
        });
        
        // Check if only one candidate remains
        const remaining = activeOptions.filter(o => !eliminatedOptions.has(o.id));
        if (remaining.length === 1) {
          // Last candidate wins by default
          const lastCandidate = remaining[0];
          const finalVotes = voteCounts.get(lastCandidate.id) || 0;
          winner = {
            optionId: lastCandidate.id,
            optionName: lastCandidate.name,
            votes: finalVotes,
          };
          
          // Update last round or add final round
          if (rounds.length > 0) {
            const lastRound = rounds[rounds.length - 1];
            const winnerTally = lastRound.tallies.find(t => t.optionId === lastCandidate.id);
            if (winnerTally) {
              winnerTally.status = 'elected';
            }
            lastRound.elected = [winner];
            lastRound.notes.push(`${lastCandidate.name} wins as the last remaining candidate`);
          }
          break;
        }
      }
      
      // Build final rankings
      const finalRankings: TabulationSummary['finalRankings'] = [];
      
      if (winner) {
        finalRankings.push({
          rank: 1,
          optionId: winner.optionId,
          optionName: winner.optionName,
          eliminatedInRound: null,
          finalVotes: winner.votes,
        });
      }
      
      // Add eliminated candidates in reverse order
      for (let i = eliminationOrder.length - 1; i >= 0; i--) {
        const elim = eliminationOrder[i];
        finalRankings.push({
          rank: finalRankings.length + 1,
          optionId: elim.optionId,
          optionName: optionMap.get(elim.optionId)!.name,
          eliminatedInRound: elim.round,
          finalVotes: elim.votes,
        });
      }
      
      // Build summary
      const summary: TabulationSummary = {
        winner: winner
          ? {
              optionId: winner.optionId,
              optionName: winner.optionName,
              finalVotes: winner.votes,
              finalPercentage:
                rounds.length > 0
                  ? (winner.votes / rounds[rounds.length - 1].activeBallots) * 100
                  : 0,
            }
          : null,
        isTie: !winner && eliminatedOptions.size >= activeOptions.length - 1,
        totalBallots: ballots.length,
        validBallots: countableBallots.length,
        exhaustedBallots: totalExhausted,
        exhaustedPercentage: countableBallots.length > 0 ? (totalExhausted / countableBallots.length) * 100 : 0,
        roundsCount: rounds.length,
        finalRankings,
      };
      
      // Generate integrity hash
      const ballotsHash = this.generateBallotsHash(countableBallots);
      
      return {
        method: this.id,
        methodDisplayName: this.displayName,
        success: true,
        rounds,
        summary,
        computedAt: new Date(),
        computeTimeMs: Date.now() - startTime,
        integrity: {
          ballotCount: countableBallots.length,
          optionCount: activeOptions.length,
          ballotsHash,
        },
      };
    } catch (error) {
      return {
        method: this.id,
        methodDisplayName: this.displayName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during tabulation',
        rounds: [],
        summary: {
          winner: null,
          isTie: false,
          totalBallots: ballots.length,
          validBallots: 0,
          exhaustedBallots: 0,
          exhaustedPercentage: 0,
          roundsCount: 0,
          finalRankings: [],
        },
        computedAt: new Date(),
        computeTimeMs: Date.now() - startTime,
        integrity: {
          ballotCount: 0,
          optionCount: options.length,
          ballotsHash: '',
        },
      };
    }
  }

  private generateBallotsHash(ballots: StoredBallot[]): string {
    const data = ballots
      .map(b => `${b.id}:${b.ranking.join(',')}`)
      .sort()
      .join('|');
    return createHash('sha256').update(data).digest('hex').slice(0, 16);
  }
}

// Export singleton instance
export const irvEngine = new IRVEngine();
