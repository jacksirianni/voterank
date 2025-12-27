'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VR</span>
            </div>
            <span className="font-display font-bold text-slate-900">VoteRank</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/#product"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Product
            </Link>
            <Link
              href="/methods"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Methods
            </Link>
            <Link
              href="/#templates"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/security"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Security
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/vote/demo-election" className="btn-secondary text-sm px-4 py-2">
              Try Demo
            </Link>
            <Link href="/create" className="btn-primary text-sm px-4 py-2">
              Create Contest
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="px-4 py-4 space-y-1">
            <Link
              href="/#product"
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Product
            </Link>
            <Link
              href="/methods"
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Methods
            </Link>
            <Link
              href="/#templates"
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link
              href="/security"
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Security
            </Link>
            <div className="pt-4 space-y-2">
              <Link
                href="/vote/demo-election"
                className="btn-secondary w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Try Demo
              </Link>
              <Link
                href="/create"
                className="btn-primary w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Contest
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
