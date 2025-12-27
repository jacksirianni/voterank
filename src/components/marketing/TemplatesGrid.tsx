import Link from 'next/link';

export function TemplatesGrid() {
  const templates = [
    {
      title: 'Team Event Planning',
      description: 'Choose the best team outing or event',
      icon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400',
      iconColor: 'text-blue-600',
      prefill: 'title=Team Outing&votingMethod=IRV&options=Happy Hour,Bowling,Karaoke,Escape Room',
    },
    {
      title: 'Book Club Selection',
      description: 'Pick your next book democratically',
      icon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400',
      iconColor: 'text-purple-600',
      prefill: 'title=Book Club Pick&votingMethod=IRV&options=Fiction,Non-fiction,Mystery,Sci-Fi',
    },
    {
      title: 'Office Lunch Vote',
      description: 'Let the team decide on lunch',
      icon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverBorder: 'hover:border-orange-400',
      iconColor: 'text-orange-600',
      prefill: 'title=Lunch Vote&votingMethod=IRV&options=Pizza,Sushi,Tacos,Salad Bar',
    },
    {
      title: 'Community Project',
      description: 'Prioritize community initiatives',
      icon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      hoverBorder: 'hover:border-emerald-400',
      iconColor: 'text-emerald-600',
      prefill: 'title=Community Project&votingMethod=STV&options=Park Cleanup,Food Drive,Mentorship,Tech Workshops',
    },
    {
      title: 'Student Council',
      description: 'Elect representatives fairly',
      icon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      hoverBorder: 'hover:border-indigo-400',
      iconColor: 'text-indigo-600',
      prefill: 'title=Student Council Election&votingMethod=IRV&options=Candidate A,Candidate B,Candidate C',
    },
    {
      title: 'Movie Night',
      description: 'Find a movie everyone enjoys',
      icon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      hoverBorder: 'hover:border-rose-400',
      iconColor: 'text-rose-600',
      prefill: 'title=Movie Night&votingMethod=IRV&options=Action,Comedy,Drama,Thriller,Sci-Fi',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50" id="templates">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-sm font-semibold uppercase tracking-wide">
              Templates
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
            Start with a <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Template</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get started quickly with pre-configured templates for common scenarios
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <Link
              key={index}
              href={`/create?${template.prefill}`}
              className={`group relative bg-white rounded-2xl border-2 ${template.borderColor} ${template.hoverBorder} p-6 transition-all hover:shadow-xl hover:-translate-y-1`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${template.bgColor} p-3.5 mb-5 shadow-md group-hover:shadow-xl transition-all group-hover:scale-110`}>
                <div className={`w-full h-full ${template.iconColor}`}>
                  {template.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="font-display font-bold text-xl mb-2 text-slate-900 group-hover:text-brand-600 transition-colors">
                {template.title}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{template.description}</p>

              {/* CTA */}
              <div className="flex items-center text-brand-600 font-semibold text-sm group-hover:gap-2 transition-all">
                <span>Use template</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
