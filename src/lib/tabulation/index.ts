import { TabulationEngine } from './types';
import { irvEngine } from './irv';

// Registry of all available tabulation engines
const engines: Map<string, TabulationEngine> = new Map();

// Register default engines
engines.set(irvEngine.id, irvEngine);

/**
 * Get a tabulation engine by ID
 */
export function getEngine(id: string): TabulationEngine | undefined {
  return engines.get(id);
}

/**
 * Get all available engines
 */
export function getAllEngines(): TabulationEngine[] {
  return Array.from(engines.values());
}

/**
 * Register a new engine (for plugins)
 */
export function registerEngine(engine: TabulationEngine): void {
  engines.set(engine.id, engine);
}

/**
 * Get engine for a voting method
 */
export function getEngineForMethod(method: string): TabulationEngine | undefined {
  // Map voting methods to engines
  const methodToEngine: Record<string, string> = {
    IRV: 'irv',
    // Future methods
    // STV: 'stv',
    // BORDA: 'borda',
    // CONDORCET: 'condorcet',
    // APPROVAL: 'approval',
    // SCORE: 'score',
    // STAR: 'star',
    // PLURALITY: 'plurality',
  };

  const engineId = methodToEngine[method];
  return engineId ? engines.get(engineId) : undefined;
}

// Re-export types and engines
export * from './types';
export { irvEngine } from './irv';
