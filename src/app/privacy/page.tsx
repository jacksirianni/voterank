import Link from 'next/link';

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-600 mb-8">Last updated: December 26, 2024</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Account Information</h3>
            <p className="text-slate-700 mb-4">
              When you create an account, we collect your email address, name, and authentication provider information (e.g., Google, Discord).
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Contest Data</h3>
            <p className="text-slate-700 mb-4">
              When you create a contest, we store the title, description, options, and configuration settings you provide.
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Voting Data</h3>
            <p className="text-slate-700 mb-4">
              When you vote, we collect your ballot (ranked choices) and may collect anti-abuse information including
              device fingerprints and hashed IP addresses to prevent duplicate voting.
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Usage Information</h3>
            <p className="text-slate-700 mb-4">
              We automatically collect technical information such as browser type, device information, and usage patterns to improve the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>To provide and operate the Service</li>
              <li>To authenticate users and secure accounts</li>
              <li>To process and tabulate votes</li>
              <li>To prevent fraud and abuse</li>
              <li>To communicate with you about your account</li>
              <li>To improve and optimize the Service</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Ballot Privacy and Anonymity</h2>
            <p className="text-slate-700 mb-4">
              <strong>Individual ballots are stored separately from personal identifiers.</strong> We do not link your
              name or email to your specific ballot choices. For anti-abuse purposes, we may store hashed device
              fingerprints and IP addresses, but these cannot be used to identify individual ballot selections.
            </p>
            <p className="text-slate-700 mb-4">
              Contest organizers can see aggregate results and vote counts but cannot see who voted for which options
              unless the contest is configured with voter identification requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-slate-700 mb-4">We do not sell your personal information. We may share data:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li><strong>With service providers:</strong> Hosting (Vercel), database (Neon), authentication (NextAuth), and payment processing (Stripe)</li>
              <li><strong>With contest organizers:</strong> Aggregate voting results and participation metrics</li>
              <li><strong>For legal compliance:</strong> When required by law or to protect our rights</li>
              <li><strong>In business transfers:</strong> If VoteRank is acquired or merged</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Retention</h2>
            <p className="text-slate-700 mb-4">
              We retain your data for as long as your account is active or as needed to provide the Service.
              You may request account deletion at any time. Contest data may be retained for archival purposes
              even after contests close.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Security</h2>
            <p className="text-slate-700 mb-4">
              We implement industry-standard security measures including encryption in transit (HTTPS), secure
              authentication, and access controls. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Rights</h2>
            <p className="text-slate-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="text-slate-700 mb-4">
              To exercise these rights, contact us via our{' '}
              <Link href="/contact" className="text-brand-600 hover:text-brand-700 underline">contact page</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Cookies and Tracking</h2>
            <p className="text-slate-700 mb-4">
              We use essential cookies for authentication and session management. We may use analytics cookies
              to understand how users interact with the Service. You can control cookie preferences through your
              browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-slate-700 mb-4">
              The Service is not intended for children under 13. We do not knowingly collect data from children
              under 13. If you believe we have collected such data, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-slate-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of material changes via
              email or through the Service. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us</h2>
            <p className="text-slate-700 mb-4">
              For questions about this Privacy Policy or our data practices, please{' '}
              <Link href="/contact" className="text-brand-600 hover:text-brand-700 underline">contact us</Link>.
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
