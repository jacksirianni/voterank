import Link from 'next/link';

export function PricingPreview() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out ranked choice voting',
      features: [
        'Unlimited contests',
        'Up to 100 voters per contest',
        'All voting methods',
        'Basic analytics',
        'Email support',
      ],
      cta: 'Start Free',
      href: '/create',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'For organizations running regular elections',
      features: [
        'Everything in Free',
        'Up to 1,000 voters per contest',
        'Custom branding',
        'Advanced analytics',
        'Priority support',
        'Export to CSV/PDF',
      ],
      cta: 'Get Started',
      href: '/pricing',
      popular: true,
    },
    {
      name: 'Team',
      price: '$99',
      period: 'per month',
      description: 'For large organizations and institutions',
      features: [
        'Everything in Pro',
        'Unlimited voters',
        'Multi-user workspaces',
        'SSO integration',
        'Dedicated support',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      href: '/pricing',
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`card p-6 flex flex-col ${
                plan.popular ? 'ring-2 ring-brand-500 shadow-xl' : ''
              }`}
            >
              {plan.popular && (
                <div className="mb-4 inline-block">
                  <span className="bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="font-display font-bold text-2xl mb-2 text-slate-900">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-600">/{plan.period}</span>
              </div>
              <p className="text-slate-600 text-sm mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg
                      className="w-5 h-5 text-brand-600 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/pricing" className="text-brand-600 hover:text-brand-700 font-medium">
            View full pricing details →
          </Link>
        </div>
      </div>
    </section>
  );
}
