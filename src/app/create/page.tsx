'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Option {
  tempId: string;
  name: string;
  description: string;
}

export default function CreateContestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [votingMethod, setVotingMethod] = useState('IRV');
  const [visibility] = useState('PUBLIC_LINK'); // Default visibility, UI coming soon
  const [ballotStyle, setBallotStyle] = useState('DRAG');
  const [requireVoterId, setRequireVoterId] = useState(false);
  const [allowPartialRanking, setAllowPartialRanking] = useState(true);
  const [options, setOptions] = useState<Option[]>([
    { tempId: '1', name: '', description: '' },
    { tempId: '2', name: '', description: '' },
  ]);

  const addOption = () => {
    setOptions([...options, { tempId: Date.now().toString(), name: '', description: '' }]);
  };

  const removeOption = (tempId: string) => {
    if (options.length > 2) {
      setOptions(options.filter(o => o.tempId !== tempId));
    }
  };

  const updateOption = (tempId: string, field: 'name' | 'description', value: string) => {
    setOptions(options.map(o => o.tempId === tempId ? { ...o, [field]: value } : o));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create contest
      const contestRes = await fetch('/api/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || undefined,
          votingMethod,
          visibility,
          ballotStyle,
          requireVoterId,
          settings: {
            allowPartialRanking,
          },
        }),
      });

      if (!contestRes.ok) {
        const data = await contestRes.json();
        throw new Error(data.error || 'Failed to create contest');
      }

      const contest = await contestRes.json();

      // Create options
      const validOptions = options.filter(o => o.name.trim());
      for (const opt of validOptions) {
        await fetch(`/api/contests/${contest.id}/options`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: opt.name,
            description: opt.description || undefined,
          }),
        });
      }

      // Redirect to voting page
      router.push(`/vote/${contest.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contest');
      setLoading(false);
    }
  };

  const canProceedStep1 = title.trim().length >= 3;
  const canProceedStep2 = options.filter(o => o.name.trim()).length >= 2;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                step >= s ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 rounded ${step > s ? 'bg-brand-500' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="card p-6">
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">Create New Contest</h1>
            <p className="text-slate-600 mb-6">Start by giving your contest a name and description.</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                  Contest Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  placeholder="e.g., Team Lunch Poll, Board Election 2024"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input min-h-[100px]"
                  placeholder="Add some context about this vote..."
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="btn-primary"
                >
                  Next: Add Options →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Options */}
        {step === 2 && (
          <div className="card p-6">
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">Add Choices</h1>
            <p className="text-slate-600 mb-6">Add at least 2 options for voters to rank.</p>

            <div className="space-y-4">
              {options.map((opt, idx) => (
                <div key={opt.tempId} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={opt.name}
                        onChange={(e) => updateOption(opt.tempId, 'name', e.target.value)}
                        className="input"
                        placeholder="Option name"
                      />
                      <input
                        type="text"
                        value={opt.description}
                        onChange={(e) => updateOption(opt.tempId, 'description', e.target.value)}
                        className="input text-sm"
                        placeholder="Description (optional)"
                      />
                    </div>
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(opt.tempId)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={addOption}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Option
              </button>

              <div className="pt-4 flex justify-between">
                <button onClick={() => setStep(1)} className="btn-ghost">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="btn-primary"
                >
                  Next: Settings →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {step === 3 && (
          <div className="card p-6">
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">Contest Settings</h1>
            <p className="text-slate-600 mb-6">Configure how voting will work.</p>

            <div className="space-y-6">
              {/* Voting Method */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Voting Method
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: 'IRV', label: 'Instant Runoff Voting', desc: 'Eliminates lowest candidate each round until one wins' },
                    { value: 'BORDA', label: 'Borda Count', desc: 'Points-based system (higher rank = more points)', disabled: true },
                    { value: 'APPROVAL', label: 'Approval Voting', desc: 'Vote for as many as you like', disabled: true },
                  ].map(method => (
                    <label
                      key={method.value}
                      className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                        votingMethod === method.value
                          ? 'border-brand-500 bg-brand-50'
                          : method.disabled
                          ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                          : 'border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="votingMethod"
                        value={method.value}
                        checked={votingMethod === method.value}
                        onChange={(e) => setVotingMethod(e.target.value)}
                        disabled={method.disabled}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                          votingMethod === method.value
                            ? 'border-brand-500 bg-brand-500'
                            : 'border-slate-300'
                        }`}>
                          {votingMethod === method.value && (
                            <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="6" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{method.label}</div>
                          <div className="text-sm text-slate-500">{method.desc}</div>
                          {method.disabled && <div className="text-xs text-brand-600 mt-1">Coming soon</div>}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ballot Style */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ballot Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`p-4 border rounded-xl cursor-pointer transition-colors text-center ${
                      ballotStyle === 'DRAG'
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-200 hover:border-brand-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ballotStyle"
                      value="DRAG"
                      checked={ballotStyle === 'DRAG'}
                      onChange={(e) => setBallotStyle(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-2xl mb-1">↕️</div>
                    <div className="font-medium text-slate-900">Drag & Drop</div>
                    <div className="text-xs text-slate-500">Reorder by dragging</div>
                  </label>
                  <label
                    className={`p-4 border rounded-xl cursor-pointer transition-colors text-center ${
                      ballotStyle === 'GRID'
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-200 hover:border-brand-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ballotStyle"
                      value="GRID"
                      checked={ballotStyle === 'GRID'}
                      onChange={(e) => setBallotStyle(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-2xl mb-1">🔢</div>
                    <div className="font-medium text-slate-900">Number Grid</div>
                    <div className="text-xs text-slate-500">Click to assign ranks</div>
                  </label>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireVoterId}
                    onChange={(e) => setRequireVoterId(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                  />
                  <div>
                    <div className="font-medium text-slate-900">Require Voter ID</div>
                    <div className="text-sm text-slate-500">Voters must enter an ID (email, student ID, etc.)</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowPartialRanking}
                    onChange={(e) => setAllowPartialRanking(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                  />
                  <div>
                    <div className="font-medium text-slate-900">Allow Partial Ranking</div>
                    <div className="text-sm text-slate-500">Voters can rank only some options</div>
                  </div>
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {error}
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button onClick={() => setStep(2)} className="btn-ghost">
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Contest'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary sidebar preview */}
        {step === 3 && (
          <div className="mt-6 card p-4 bg-slate-50">
            <div className="text-sm font-medium text-slate-700 mb-2">Contest Summary</div>
            <div className="space-y-1 text-sm text-slate-600">
              <div><strong>Title:</strong> {title}</div>
              <div><strong>Options:</strong> {options.filter(o => o.name.trim()).length}</div>
              <div><strong>Method:</strong> {votingMethod}</div>
              <div><strong>Style:</strong> {ballotStyle === 'DRAG' ? 'Drag & Drop' : 'Number Grid'}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
