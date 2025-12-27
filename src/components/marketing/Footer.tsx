import Link from 'next/link';

export function Footer() {
  const sections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/#product' },
        { label: 'Methods', href: '/methods' },
        { label: 'Templates', href: '/#templates' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'Security', href: '/security' },
        { label: 'Support', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Acceptable Use', href: '/acceptable-use' },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VR</span>
              </div>
              <span className="font-display font-bold text-slate-900">VoteRank</span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">
              Better decisions through ranked choice voting
            </p>
          </div>

          {/* Links Sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-slate-900 mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-brand-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} VoteRank. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 text-center">
              Not for legally binding elections. For decisions, polls, and informal voting.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
