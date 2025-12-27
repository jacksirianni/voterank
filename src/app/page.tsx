import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { TrustChips } from '@/components/marketing/TrustChips';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { ProductPreview } from '@/components/marketing/ProductPreview';
import { TemplatesGrid } from '@/components/marketing/TemplatesGrid';
import { TrustAndControls } from '@/components/marketing/TrustAndControls';
import { MethodsTeaser } from '@/components/marketing/MethodsTeaser';
import { PricingPreview } from '@/components/marketing/PricingPreview';
import { FAQ } from '@/components/marketing/FAQ';
import { Footer } from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-block mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-200 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                <span className="text-sm font-semibold text-brand-700">
                  Free forever • 8 voting methods • No credit card
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-brand-600 to-slate-900 bg-clip-text text-transparent">
                Better decisions through
              </span>
              <br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                ranked choice voting
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-slate-600 mb-10 leading-relaxed max-w-4xl mx-auto">
              Create polls and elections where every voice counts. Watch transparent round-by-round results
              show exactly how your winner emerged.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/create"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gradient text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-brand-500/50 transition-all hover:scale-105"
              >
                Create Free Contest
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-semibold text-lg hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-all hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Try Interactive Demo
              </Link>
            </div>

            {/* Quick Link */}
            <Link
              href="/demo"
              className="group inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              <span>View sample results</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <TrustChips />
      <HowItWorks />
      <ProductPreview />
      <TemplatesGrid />
      <TrustAndControls />
      <MethodsTeaser />
      <PricingPreview />
      <FAQ />

      {/* Final CTA */}
      <section className="relative py-24 bg-gradient-to-br from-brand-500 via-brand-600 to-purple-600 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mb-6">
            Ready to make better decisions?
          </h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Join thousands making fairer decisions. Create your first contest in minutes—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-600 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all hover:scale-105 shadow-2xl"
            >
              Get Started Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/methods"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Explore Voting Methods
            </Link>
          </div>
          <p className="mt-6 text-sm text-brand-100">
            ✓ Free forever &nbsp;•&nbsp; ✓ No credit card &nbsp;•&nbsp; ✓ Setup in 2 minutes
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
