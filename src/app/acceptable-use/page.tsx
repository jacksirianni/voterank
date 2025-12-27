import Link from 'next/link';

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-xl font-display font-bold bg-brand-gradient bg-clip-text text-transparent">
            VoteRank
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Acceptable Use Policy</h1>
        <p className="text-slate-600 mb-8">Last updated: December 26, 2024</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <p className="text-slate-700 mb-4">
              This Acceptable Use Policy governs your use of VoteRank. By using the Service, you agree to comply
              with this policy. Violation may result in suspension or termination of your access.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Prohibited Uses</h2>
            <p className="text-slate-700 mb-4">You may not use VoteRank to:</p>

            <h3 className="text-xl font-semibold text-slate-800 mb-2 mt-6">1. Conduct Illegal or Harmful Activities</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>Violate any local, state, national, or international law or regulation</li>
              <li>Conduct legally binding elections without proper authorization or compliance</li>
              <li>Engage in fraud, deception, or misrepresentation</li>
              <li>Harass, threaten, or harm others</li>
              <li>Infringe on intellectual property rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-2 mt-6">2. Abuse or Manipulate the Service</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>Attempt to manipulate voting results through duplicate votes, bots, or automated scripts</li>
              <li>Create fake accounts or impersonate others</li>
              <li>Circumvent access controls or security measures</li>
              <li>Overload or interfere with the Service&apos;s infrastructure</li>
              <li>Reverse engineer, decompile, or extract source code</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-2 mt-6">3. Distribute Harmful or Inappropriate Content</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>Distribute malware, viruses, or malicious code</li>
              <li>Share spam, unsolicited commercial content, or chain messages</li>
              <li>Post illegal, obscene, defamatory, or offensive content</li>
              <li>Share content that promotes violence, hate speech, or discrimination</li>
              <li>Violate others&apos; privacy by sharing personal information without consent</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-2 mt-6">4. Misuse Voting Features</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>Use the Service for elections that require legal compliance (government, union, corporate board elections)</li>
              <li>Conduct contests involving money, gambling, or prizes without legal authorization</li>
              <li>Create contests designed to collect personal information for unauthorized purposes</li>
              <li>Use voting results to make binding legal, financial, or employment decisions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Acceptable Uses</h2>
            <p className="text-slate-700 mb-4">VoteRank is designed for:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>Informal decision-making and polls (team lunches, book club picks, event planning)</li>
              <li>Non-binding elections (club officers, committee preferences, community awards)</li>
              <li>Gathering preferences and opinions (feature prioritization, design choices)</li>
              <li>Educational demonstrations of ranked choice voting</li>
              <li>Research and analysis of voting methods (with appropriate disclosures)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Content Responsibility</h2>
            <p className="text-slate-700 mb-4">
              You are solely responsible for the content you create, including contest titles, descriptions, and options.
              We do not pre-screen content but reserve the right to remove content that violates this policy.
            </p>
            <p className="text-slate-700 mb-4">
              If you encounter content that violates this policy, please{' '}
              <Link href="/contact" className="text-brand-600 hover:text-brand-700 underline">report it to us</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Security and Privacy</h2>
            <p className="text-slate-700 mb-4">
              You must:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>Keep your account credentials and admin tokens confidential</li>
              <li>Notify us immediately of any security breach or unauthorized access</li>
              <li>Respect voter privacy and not attempt to de-anonymize ballots</li>
              <li>Comply with applicable data protection and privacy laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Rate Limits and Fair Use</h2>
            <p className="text-slate-700 mb-4">
              To ensure fair access for all users, we may impose rate limits on:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>Contest creation</li>
              <li>Vote submissions</li>
              <li>API requests</li>
              <li>Data exports</li>
            </ul>
            <p className="text-slate-700 mb-4">
              Excessive use may result in throttling or suspension. Contact us if you have legitimate high-volume needs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Enforcement</h2>
            <p className="text-slate-700 mb-4">
              Violations of this Acceptable Use Policy may result in:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>Warning or notice to cease the prohibited activity</li>
              <li>Temporary suspension of account access</li>
              <li>Permanent termination of account</li>
              <li>Removal of contests or content</li>
              <li>Legal action if required by law</li>
            </ul>
            <p className="text-slate-700 mb-4">
              We reserve the right to take action at our sole discretion, with or without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Reporting Violations</h2>
            <p className="text-slate-700 mb-4">
              If you believe someone is violating this policy, please{' '}
              <Link href="/contact" className="text-brand-600 hover:text-brand-700 underline">contact us</Link>{' '}
              with details including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>The specific content or behavior</li>
              <li>The contest URL or user involved</li>
              <li>How it violates this policy</li>
              <li>Any relevant screenshots or evidence</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
            <p className="text-slate-700 mb-4">
              We may update this Acceptable Use Policy at any time. Continued use of the Service after changes
              constitutes acceptance of the modified policy. See our{' '}
              <Link href="/terms" className="text-brand-600 hover:text-brand-700 underline">Terms of Service</Link>{' '}
              for more information.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/" className="text-brand-600 hover:text-brand-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
