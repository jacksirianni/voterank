import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: {
    default: 'VoteRank - Modern Ranked Choice Voting',
    template: '%s | VoteRank',
  },
  description: 'Create polls and elections with ranked choice voting. Simple, transparent, and fair results.',
  keywords: ['voting', 'ranked choice voting', 'instant runoff', 'polls', 'elections', 'IRV'],
  authors: [{ name: 'VoteRank' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/icon-512.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'VoteRank',
    title: 'VoteRank - Modern Ranked Choice Voting',
    description: 'Create polls and elections with ranked choice voting.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoteRank - Modern Ranked Choice Voting',
    description: 'Create polls and elections with ranked choice voting.',
    images: ['/twitter-banner.svg'],
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
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className="h-full">
          <div className="min-h-full flex flex-col">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
