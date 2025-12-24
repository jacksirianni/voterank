// ============================================================================
// INTERNATIONALIZATION SETUP
// ============================================================================

export type Locale = 'en' | 'es' | 'fr' | 'de';

export const defaultLocale: Locale = 'en';

export const locales: Locale[] = ['en', 'es', 'fr', 'de'];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

// Translation keys organized by namespace
export interface Translations {
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    submit: string;
    back: string;
    next: string;
    create: string;
    edit: string;
    delete: string;
    confirm: string;
    close: string;
    open: string;
    search: string;
    filter: string;
    sort: string;
    yes: string;
    no: string;
    or: string;
    and: string;
  };
  voting: {
    submitBallot: string;
    yourRanking: string;
    dragToRank: string;
    clickToRank: string;
    clearRanking: string;
    rank: string;
    unranked: string;
    submitSuccess: string;
    alreadyVoted: string;
    contestClosed: string;
    contestNotOpen: string;
    rankingInstructions: string;
    partialRankingAllowed: string;
    rankAll: string;
  };
  results: {
    results: string;
    winner: string;
    noWinner: string;
    tie: string;
    round: string;
    eliminated: string;
    elected: string;
    votes: string;
    percentage: string;
    exhausted: string;
    transferred: string;
    majority: string;
    totalBallots: string;
    validBallots: string;
    rounds: string;
    howItWorks: string;
    viewDetails: string;
  };
  contest: {
    createContest: string;
    editContest: string;
    contestTitle: string;
    description: string;
    options: string;
    addOption: string;
    removeOption: string;
    votingMethod: string;
    visibility: string;
    status: string;
    startDate: string;
    endDate: string;
    timezone: string;
    settings: string;
    shareLink: string;
    copyLink: string;
    linkCopied: string;
  };
  errors: {
    required: string;
    invalidEmail: string;
    tooLong: string;
    tooShort: string;
    notFound: string;
    unauthorized: string;
    forbidden: string;
    rateLimited: string;
    serverError: string;
  };
}

// English translations (default)
const en: Translations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    close: 'Close',
    open: 'Open',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    and: 'and',
  },
  voting: {
    submitBallot: 'Submit Ballot',
    yourRanking: 'Your Ranking',
    dragToRank: 'Drag candidates to rank them',
    clickToRank: 'Click to assign ranks',
    clearRanking: 'Clear Ranking',
    rank: 'Rank',
    unranked: 'Unranked',
    submitSuccess: 'Your vote has been submitted!',
    alreadyVoted: 'You have already voted in this contest',
    contestClosed: 'This contest is closed',
    contestNotOpen: 'This contest is not open for voting',
    rankingInstructions: 'Rank the candidates in order of preference. Your first choice is most preferred.',
    partialRankingAllowed: 'You don\'t have to rank all candidates',
    rankAll: 'Rank all candidates',
  },
  results: {
    results: 'Results',
    winner: 'Winner',
    noWinner: 'No Winner',
    tie: 'Tie',
    round: 'Round',
    eliminated: 'Eliminated',
    elected: 'Elected',
    votes: 'votes',
    percentage: 'of vote',
    exhausted: 'Exhausted',
    transferred: 'Transferred',
    majority: 'Majority Threshold',
    totalBallots: 'Total Ballots',
    validBallots: 'Valid Ballots',
    rounds: 'Rounds',
    howItWorks: 'How it works',
    viewDetails: 'View details',
  },
  contest: {
    createContest: 'Create Contest',
    editContest: 'Edit Contest',
    contestTitle: 'Contest Title',
    description: 'Description',
    options: 'Options',
    addOption: 'Add Option',
    removeOption: 'Remove Option',
    votingMethod: 'Voting Method',
    visibility: 'Visibility',
    status: 'Status',
    startDate: 'Start Date',
    endDate: 'End Date',
    timezone: 'Timezone',
    settings: 'Settings',
    shareLink: 'Share Link',
    copyLink: 'Copy Link',
    linkCopied: 'Link copied!',
  },
  errors: {
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    tooLong: 'This value is too long',
    tooShort: 'This value is too short',
    notFound: 'Not found',
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
    rateLimited: 'Too many requests. Please try again later.',
    serverError: 'An error occurred. Please try again.',
  },
};

// Store translations by locale
const translations: Record<Locale, Translations> = {
  en,
  // Placeholder for other languages - add translations here
  es: en, // Spanish (TODO: translate)
  fr: en, // French (TODO: translate)
  de: en, // German (TODO: translate)
};

/**
 * Get translations for a locale
 */
export function getTranslations(locale: Locale = defaultLocale): Translations {
  return translations[locale] || translations[defaultLocale];
}

/**
 * Simple translation function
 */
export function t(
  key: string,
  locale: Locale = defaultLocale,
  params?: Record<string, string | number>
): string {
  const parts = key.split('.');
  let value: unknown = translations[locale] || translations[defaultLocale];
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  if (typeof value !== 'string') return key;
  
  // Replace parameters
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, name) => {
      return params[name]?.toString() || `{${name}}`;
    });
  }
  
  return value;
}
