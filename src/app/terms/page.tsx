import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Simple Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-xl font-display font-bold bg-brand-gradient bg-clip-text text-transparent">
            VoteRank
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Terms of Service</h1>
        <p className="text-slate-600 mb-8">Last updated: December 26, 2024</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-700 mb-4">
              By accessing or using VoteRank (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
            <p className="text-slate-700 mb-4">
              VoteRank provides online voting and polling tools using ranked choice voting methods including
              Instant Runoff Voting (IRV), Single Transferable Vote (STV), and STAR voting. The Service is
              designed for informal decision-making, polls, and non-binding elections.
            </p>
            <p className="text-slate-700 mb-4">
              <strong>Important:</strong> VoteRank is NOT intended for legally binding elections, government
              elections, or situations where regulatory compliance is required. Users are solely responsible
              for ensuring compliance with applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts and Responsibilities</h2>
            <p className="text-slate-700 mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>Maintaining the confidentiality of your account credentials and admin tokens</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring your use complies with applicable laws and regulations</li>
              <li>The accuracy and appropriateness of content you create</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Acceptable Use</h2>
            <p className="text-slate-700 mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>Conduct legally binding elections without proper authorization</li>
              <li>Violate any laws or regulations</li>
              <li>Harass, abuse, or harm others</li>
              <li>Distribute spam, malware, or harmful content</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Interfere with the Service&apos;s operation or security</li>
              <li>Attempt to manipulate or fraudulently influence voting results</li>
            </ul>
            <p className="text-slate-700 mb-4">
              For complete usage guidelines, see our <Link href="/acceptable-use" className="text-brand-600 hover:text-brand-700 underline">Acceptable Use Policy</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data and Privacy</h2>
            <p className="text-slate-700 mb-4">
              Our collection and use of personal information is described in our{' '}
              <Link href="/privacy" className="text-brand-600 hover:text-brand-700 underline">Privacy Policy</Link>.
              By using the Service, you consent to our data practices as described therein.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Intellectual Property</h2>
            <p className="text-slate-700 mb-4">
              The Service and its original content, features, and functionality are owned by VoteRank and are
              protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-slate-700 mb-4">
              You retain ownership of content you create (contest titles, descriptions, options). By using the
              Service, you grant us a license to use, store, and display this content solely to provide the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Disclaimers and Limitations</h2>
            <p className="text-slate-700 mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>The Service will be uninterrupted, secure, or error-free</li>
              <li>Results will be accurate or reliable for official purposes</li>
              <li>The Service meets your specific requirements</li>
              <li>Data loss will not occur</li>
            </ul>
            <p className="text-slate-700 mb-4">
              IN NO EVENT SHALL VOTERANK BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Subscription and Payments</h2>
            <p className="text-slate-700 mb-4">
              Some features require a paid subscription. Subscription fees are billed in advance on a recurring
              basis. You may cancel your subscription at any time, but refunds are not provided for partial
              billing periods.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Termination</h2>
            <p className="text-slate-700 mb-4">
              We reserve the right to suspend or terminate your access to the Service at any time, with or
              without cause, with or without notice, for any violation of these Terms or for any other reason.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to Terms</h2>
            <p className="text-slate-700 mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of material changes
              via email or through the Service. Continued use of the Service after changes constitutes acceptance
              of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Governing Law</h2>
            <p className="text-slate-700 mb-4">
              These Terms are governed by and construed in accordance with the laws of the United States,
              without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact</h2>
            <p className="text-slate-700 mb-4">
              For questions about these Terms, please contact us at{' '}
              <Link href="/contact" className="text-brand-600 hover:text-brand-700 underline">our contact page</Link>.
            </p>
          </section>
        </div>

        {/* Back to home */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/" className="text-brand-600 hover:text-brand-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
