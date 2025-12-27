import Link from 'next/link';

export function TemplatesGrid() {
  const templates = [
    {
      title: 'Team Event Planning',
      description: 'Choose the best team outing or event',
      icon: '🎉',
      prefill: 'title=Team Outing&votingMethod=IRV&options=Happy Hour,Bowling,Karaoke,Escape Room',
    },
    {
      title: 'Book Club Selection',
      description: 'Pick your next book democratically',
      icon: '📚',
      prefill: 'title=Book Club Pick&votingMethod=IRV&options=Fiction,Non-fiction,Mystery,Sci-Fi',
    },
    {
      title: 'Office Lunch Vote',
      description: 'Let the team decide on lunch',
      icon: '🍕',
      prefill: 'title=Lunch Vote&votingMethod=IRV&options=Pizza,Sushi,Tacos,Salad Bar',
    },
    {
      title: 'Community Project',
      description: 'Prioritize community initiatives',
      icon: '🏘️',
      prefill: 'title=Community Project&votingMethod=STV&options=Park Cleanup,Food Drive,Mentorship,Tech Workshops',
    },
    {
      title: 'Student Council',
      description: 'Elect representatives fairly',
      icon: '🎓',
      prefill: 'title=Student Council Election&votingMethod=IRV&options=Candidate A,Candidate B,Candidate C',
    },
    {
      title: 'Movie Night',
      description: 'Find a movie everyone enjoys',
      icon: '🎬',
      prefill: 'title=Movie Night&votingMethod=IRV&options=Action,Comedy,Drama,Thriller,Sci-Fi',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200" id="templates">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-3">
            Start with a Template
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get started quickly with pre-configured templates for common scenarios
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <Link
              key={index}
              href={`/create?${template.prefill}`}
              className="card p-6 hover:shadow-lg hover:border-brand-300 transition-all group"
            >
              <div className="text-4xl mb-3">{template.icon}</div>
              <h3 className="font-display font-semibold text-lg mb-2 text-slate-900 group-hover:text-brand-600 transition-colors">
                {template.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4">{template.description}</p>
              <div className="flex items-center text-brand-600 text-sm font-medium">
                Use template
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
