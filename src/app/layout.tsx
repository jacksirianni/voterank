import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'VoteRank - Modern Ranked Choice Voting',
    template: '%s | VoteRank',
  },
  description: 'Create polls and elections with ranked choice voting. Simple, transparent, and fair results.',
  keywords: ['voting', 'ranked choice voting', 'instant runoff', 'polls', 'elections', 'IRV'],
  authors: [{ name: 'VoteRank' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'VoteRank',
    title: 'VoteRank - Modern Ranked Choice Voting',
    description: 'Create polls and elections with ranked choice voting.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoteRank - Modern Ranked Choice Voting',
    description: 'Create polls and elections with ranked choice voting.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <div className="min-h-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
