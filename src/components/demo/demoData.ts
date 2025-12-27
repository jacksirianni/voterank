export interface DemoCandidate {
  id: string;
  title: string;
  description: string;
  album?: string;
  year?: string;
}

export const DEMO_CANDIDATES: DemoCandidate[] = [
  {
    id: 'hey-jude',
    title: 'Hey Jude',
    description: 'A timeless singalong anthem with an unforgettable coda that brings audiences together.',
    album: 'Hey Jude',
    year: '1968',
  },
  {
    id: 'let-it-be',
    title: 'Let It Be',
    description: 'An uplifting piano ballad offering solace and wisdom during troubled times.',
    album: 'Let It Be',
    year: '1970',
  },
  {
    id: 'come-together',
    title: 'Come Together',
    description: 'A groove-heavy opener with cryptic lyrics and an iconic bassline.',
    album: 'Abbey Road',
    year: '1969',
  },
  {
    id: 'yesterday',
    title: 'Yesterday',
    description: 'A melancholic reflection on lost love, featuring a simple yet powerful string arrangement.',
    album: 'Help!',
    year: '1965',
  },
  {
    id: 'here-comes-the-sun',
    title: 'Here Comes the Sun',
    description: 'A bright and optimistic tune celebrating the return of warmer days.',
    album: 'Abbey Road',
    year: '1969',
  },
  {
    id: 'a-day-in-the-life',
    title: 'A Day in the Life',
    description: 'An ambitious masterpiece blending contrasting perspectives with orchestral grandeur.',
    album: 'Sgt. Pepper\'s',
    year: '1967',
  },
  {
    id: 'something',
    title: 'Something',
    description: 'A tender love song with elegant guitar work and heartfelt vocals.',
    album: 'Abbey Road',
    year: '1969',
  },
  {
    id: 'eleanor-rigby',
    title: 'Eleanor Rigby',
    description: 'A poignant narrative exploring themes of loneliness, backed by a haunting string quartet.',
    album: 'Revolver',
    year: '1966',
  },
  {
    id: 'while-my-guitar-gently-weeps',
    title: 'While My Guitar Gently Weeps',
    description: 'A contemplative track featuring expressive guitar solos and introspective themes.',
    album: 'The Beatles',
    year: '1968',
  },
  {
    id: 'strawberry-fields-forever',
    title: 'Strawberry Fields Forever',
    description: 'A psychedelic exploration of memory and reality with innovative production techniques.',
    album: 'Magical Mystery Tour',
    year: '1967',
  },
];

export const RANK_LABELS = ['1st', '2nd', '3rd', '4th', '5th'] as const;
export const NUM_RANKS = 5;
