'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { slugify, generateSlugSuggestions } from '@/lib/slug';

interface Option {
  tempId: string;
  name: string;
  description: string;
}

function CreateContestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [voteLink, setVoteLink] = useState('');
  const [adminLink, setAdminLink] = useState('');

  // T2.1: Step 1 fields
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  // Smart slug state
  const [slugMode, setSlugMode] = useState<'auto' | 'manual'>('auto');
  const [slugBase, setSlugBase] = useState('');
  const [slugFinal, setSlugFinal] = useState('');
  const [slugError, setSlugError] = useState('');
  const [slugAvailable, setSlugAvailable] = useState(false);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugSuggestions, setSlugSuggestions] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [contestType, setContestType] = useState('POLL');
  const [description, setDescription] = useState('');

  // T2.2: Step 2 fields
  const [votingMethod, setVotingMethod] = useState('IRV');
  const [ballotStyle, setBallotStyle] = useState('DRAG');
  const [winnersCount, setWinnersCount] = useState(1);
  const [methodError, setMethodError] = useState('');

  // Step 3: Options
  const [options, setOptions] = useState<Option[]>([
    { tempId: '1', name: '', description: '' },
    { tempId: '2', name: '', description: '' },
  ]);

  // T2.3: Step 4 - Access Control
  const [visibility, setVisibility] = useState('PUBLIC_LINK');
  const [requireVoterId, setRequireVoterId] = useState(false);
  const [allowPartialRanking, setAllowPartialRanking] = useState(true);
  const [deduplicationEnabled, setDeduplicationEnabled] = useState(false);
  const [allowedVoters, setAllowedVoters] = useState('');

  // Check slug availability
  const checkSlugAvailability = useCallback(async (slug: string): Promise<boolean> => {
    if (slug.length < 3) return false;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch(`/api/slug-availability?slug=${encodeURIComponent(slug)}`, {
        signal: controller.signal,
      });
      const data = await res.json();

      // Ignore if this request was aborted
      if (controller.signal.aborted) return false;

      return data.available === true;
    } catch (error) {
      // Ignore abort errors
      if ((error as Error).name === 'AbortError') return false;
      console.error('Slug check error:', error);
      return false;
    }
  }, []);

  // Find unique slug in auto mode
  const findUniqueSlug = useCallback(async (base: string) => {
    const cleanBase = slugify(base);
    if (!cleanBase || cleanBase.length < 3) return null;

    // Try base first
    const baseAvailable = await checkSlugAvailability(cleanBase);
    if (baseAvailable) return cleanBase;

    // Try numbered variations
    for (let i = 2; i <= 10; i++) {
      const candidate = `${cleanBase}-${i}`;
      const available = await checkSlugAvailability(candidate);
      if (available) return candidate;
    }

    return null;
  }, [checkSlugAvailability]);

  // Auto mode: Update slug when title changes
  useEffect(() => {
    if (slugMode !== 'auto' || !title) return;

    const newBase = slugify(title);
    if (newBase === slugBase) return; // No change

    setSlugBase(newBase);

    // Find unique slug
    const updateSlug = async () => {
      setSlugChecking(true);
      const uniqueSlug = await findUniqueSlug(title);
      if (uniqueSlug) {
        setSlugFinal(uniqueSlug);
        setSlugAvailable(true);
        setSlugError('');
        setSlugSuggestions([]);
      } else {
        setSlugFinal(newBase);
        setSlugAvailable(false);
        setSlugError('Unable to find available slug');
        setSlugSuggestions(generateSlugSuggestions(newBase));
      }
      setSlugChecking(false);
    };

    updateSlug();
  }, [title, slugMode, slugBase, findUniqueSlug]);

  // Manual mode: Debounced availability check
  useEffect(() => {
    if (slugMode !== 'manual' || !slugFinal || slugFinal.length < 3) {
      if (slugMode === 'manual' && slugFinal.length > 0 && slugFinal.length < 3) {
        setSlugAvailable(false);
        setSlugError('Slug must be at least 3 characters');
      }
      return;
    }

    setSlugChecking(true);
    const timer = setTimeout(async () => {
      const available = await checkSlugAvailability(slugFinal);

      setSlugAvailable(available);
      if (available) {
        setSlugError('');
        setSlugSuggestions([]);
      } else {
        setSlugError('This slug is not available');
        setSlugSuggestions(generateSlugSuggestions(slugFinal));
      }
      setSlugChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slugFinal, slugMode, checkSlugAvailability]);

  // Template prefill from query params
  useEffect(() => {
    const prefillTitle = searchParams.get('title');
    const prefillOptions = searchParams.get('options');
    const prefillMethod = searchParams.get('votingMethod');

    if (prefillTitle) {
      setTitle(prefillTitle);
    }

    if (prefillMethod && ['IRV', 'STV', 'STAR', 'BORDA', 'APPROVAL', 'SCORE'].includes(prefillMethod)) {
      setVotingMethod(prefillMethod);
    }

    if (prefillOptions) {
      const optionNames = prefillOptions.split(',').map(o => o.trim()).filter(Boolean);
      if (optionNames.length >= 2) {
        const newOptions = optionNames.map((name, index) => ({
          tempId: String(index + 1),
          name,
          description: '',
        }));
        setOptions(newOptions);
      }
    }
  }, [searchParams]);

  // T2.1: Validate title
  const validateTitle = (value: string) => {
    if (value.trim().length < 3) {
      setTitleError('Title must be at least 3 characters');
      return false;
    }
    if (value.length > 200) {
      setTitleError('Title cannot exceed 200 characters');
      return false;
    }
    setTitleError('');
    return true;
  };

  // Handle manual slug edit
  const handleSlugEdit = (value: string) => {
    setSlugMode('manual');
    const formatted = slugify(value);
    setSlugFinal(formatted);
  };

  // Reset to auto mode
  const resetToAutoMode = () => {
    setSlugMode('auto');
    setSlugBase(''); // Force regeneration
  };

  // T2.2: Validate method combination
  const validateMethodCombination = () => {
    if (votingMethod === 'IRV' && winnersCount > 1) {
      setMethodError('IRV is a single-winner method. Use STV for multi-winner elections.');
      return false;
    }
    if (votingMethod === 'STV' && winnersCount < 2) {
      setMethodError('STV requires at least 2 winners.');
      return false;
    }
    setMethodError('');
    return true;
  };

  useEffect(() => {
    validateMethodCombination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [votingMethod, winnersCount]);

  // Option management
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

  // Step validation
  const canProceedStep1 =
    title.trim().length >= 3 &&
    !titleError &&
    slugFinal.length >= 3 &&
    !slugError &&
    slugAvailable &&
    !slugChecking &&
    contestType !== '';

  const canProceedStep2 = !methodError;

  const canProceedStep3 = options.filter(o => o.name.trim()).length >= 2;

  const canProceedStep4 =
    visibility !== 'RESTRICTED_LIST' ||
    allowedVoters.split('\n').filter(v => v.trim()).length > 0;

  // T2.4: Handle publish
  const handlePublish = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create contest
      const contestRes = await fetch('/api/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slugFinal,
          description: description || undefined,
          contestType,
          votingMethod,
          visibility,
          ballotStyle,
          requireVoterId,
          deduplicationEnabled,
          settings: {
            allowPartialRanking,
            winnersCount: votingMethod === 'STV' ? winnersCount : 1,
          },
        }),
      });

      if (!contestRes.ok) {
        const data = await contestRes.json();
        throw new Error(data.error || 'Failed to create contest');
      }

      const contest = await contestRes.json();

      // 2. Create options
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

      // 3. Create allowed voters (if restricted)
      if (visibility === 'RESTRICTED_LIST') {
        const voters = allowedVoters.split('\n').filter(v => v.trim());
        for (const voterId of voters) {
          await fetch(`/api/contests/${contest.id}/allowed-voters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voterId: voterId.trim() }),
          });
        }
      }

      // 4. Show success screen with links
      const baseUrl = window.location.origin;
      setVoteLink(`${baseUrl}/vote/${contest.slug}`);
      setAdminLink(`${baseUrl}/dashboard/contest/${contest.id}?token=${contest.adminToken}`);
      setPublished(true);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contest');
      setLoading(false);
    }
  };

  // If published, show success screen
  if (published) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden flex flex-col">
        <Header />

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <main className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">Contest Published!</h1>
              <p className="text-lg text-slate-600">Your contest is ready for voters.</p>
            </div>

          <div className="space-y-4">
            {/* Vote link */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl p-8">
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Vote Link <span className="text-slate-500 font-normal">(Share with voters)</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={voteLink}
                  readOnly
                  className="input flex-1 font-mono text-sm bg-slate-50"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(voteLink);
                    alert('Link copied to clipboard!');
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Admin link */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl shadow-xl p-8">
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Admin Link <span className="text-amber-700 font-normal">(Keep this secret!)</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={adminLink}
                  readOnly
                  className="input flex-1 font-mono text-sm bg-white"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(adminLink);
                    alert('Link copied to clipboard!');
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-amber-700 mt-4 flex items-start gap-2 bg-white/60 rounded-xl p-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Anyone with this link can manage your contest. Keep it safe!</span>
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => router.push(voteLink)}
              className="px-8 py-4 rounded-xl font-semibold text-lg bg-white border-2 border-slate-300 text-slate-700 hover:border-purple-300 hover:shadow-lg transition-all"
            >
              Preview Voting Page
            </button>
            <button
              onClick={() => router.push(adminLink)}
              className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Manage Contest
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden flex flex-col">
      <Header />

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 left-1/3 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 relative z-10 w-full">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-1.5 bg-purple-100 text-purple-700 font-semibold text-sm rounded-full uppercase tracking-wide">
              Create Contest
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
            Launch Your Vote
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Set up a ranked choice election in minutes
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12">
          {[
            { num: 1, label: 'Info' },
            { num: 2, label: 'Method' },
            { num: 3, label: 'Options' },
            { num: 4, label: 'Access' }
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg transition-all ${
                  step >= s.num
                    ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}>
                  {s.num}
                </div>
                <span className={`text-xs sm:text-sm mt-2 font-medium ${step >= s.num ? 'text-purple-700' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div className={`w-8 sm:w-16 h-1 rounded-full mb-6 transition-all ${
                  step > s.num ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* T2.1: Step 1 - Basic Info */}
        {step === 1 && (
          <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl p-8 sm:p-10">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-3">Basic Information</h2>
            <p className="text-slate-600 mb-8 text-lg">Give your contest a name and choose its type.</p>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                  Contest Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    validateTitle(e.target.value);
                  }}
                  onBlur={(e) => validateTitle(e.target.value)}
                  className={`input ${titleError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="e.g., Team Lunch Poll, Board Election 2024"
                />
                {titleError && (
                  <p className="text-red-600 text-sm mt-1">{titleError}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-2">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm whitespace-nowrap">voterank.app/vote/</span>
                    <input
                      type="text"
                      id="slug"
                      value={slugFinal}
                      onChange={(e) => handleSlugEdit(e.target.value)}
                      className={`input flex-1 font-mono ${
                        slugError
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                          : slugAvailable
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
                          : ''
                      }`}
                      placeholder="my-contest-2024"
                    />
                  </div>

                  {/* Status indicators */}
                  <div className="mt-2 space-y-2">
                    {/* Checking indicator */}
                    {slugChecking && (
                      <p className="text-slate-500 text-sm flex items-center gap-1.5">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Checking availability…
                      </p>
                    )}

                    {/* Error message */}
                    {!slugChecking && slugError && (
                      <div className="space-y-2">
                        <p className="text-red-600 text-sm flex items-center gap-1.5">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {slugError}
                        </p>
                        {/* Suggestions */}
                        {slugSuggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-slate-600">Try:</span>
                            {slugSuggestions.map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => {
                                  setSlugMode('manual');
                                  setSlugFinal(suggestion);
                                }}
                                className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Available indicator */}
                    {!slugChecking && slugAvailable && slugFinal.length >= 3 && (
                      <p className="text-green-600 text-sm flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Available
                      </p>
                    )}

                    {/* Mode indicator */}
                    <div className="flex items-center gap-2 text-xs">
                      {slugMode === 'auto' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Auto-generated
                          </span>
                          <button
                            type="button"
                            onClick={() => setSlugMode('manual')}
                            className="text-brand-600 hover:text-brand-700 font-medium"
                          >
                            Customize
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Custom slug
                          </span>
                          <button
                            type="button"
                            onClick={resetToAutoMode}
                            className="text-brand-600 hover:text-brand-700 font-medium"
                          >
                            Reset to auto
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contest Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-4">
                  Contest Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      value: 'POLL',
                      label: 'Poll',
                      desc: 'Quick decision poll',
                      bgColor: 'bg-blue-50',
                      borderColor: 'border-blue-300',
                      iconColor: 'text-blue-600',
                      icon: (
                        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00 2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )
                    },
                    {
                      value: 'ELECTION',
                      label: 'Election',
                      desc: 'Formal election',
                      bgColor: 'bg-purple-50',
                      borderColor: 'border-purple-300',
                      iconColor: 'text-purple-600',
                      icon: (
                        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      )
                    },
                    {
                      value: 'SURVEY',
                      label: 'Survey',
                      desc: 'Multi-question survey',
                      bgColor: 'bg-green-50',
                      borderColor: 'border-green-300',
                      iconColor: 'text-green-600',
                      icon: (
                        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )
                    },
                    {
                      value: 'RANKING',
                      label: 'Ranking',
                      desc: 'General ranking',
                      bgColor: 'bg-amber-50',
                      borderColor: 'border-amber-300',
                      iconColor: 'text-amber-600',
                      icon: (
                        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      )
                    },
                  ].map(type => (
                    <label
                      key={type.value}
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all group ${
                        contestType === type.value
                          ? `${type.borderColor} ${type.bgColor} shadow-lg`
                          : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <input
                        type="radio"
                        name="contestType"
                        value={type.value}
                        checked={contestType === type.value}
                        onChange={(e) => setContestType(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-14 h-14 rounded-xl ${type.bgColor} ${type.iconColor} p-3 mb-3 transition-transform ${
                        contestType === type.value ? 'scale-110' : 'group-hover:scale-105'
                      }`}>
                        {type.icon}
                      </div>
                      <div className="font-semibold text-slate-900 mb-1">{type.label}</div>
                      <div className="text-sm text-slate-600">{type.desc}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
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
                  Next: Voting Method →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* T2.2: Step 2 - Voting Method */}
        {step === 2 && (
          <div className="card p-6">
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">Voting Method</h1>
            <p className="text-slate-600 mb-6">Choose how votes will be counted.</p>

            <div className="space-y-6">
              {/* Voting Method */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Method <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'IRV', label: 'Instant Runoff Voting (IRV)', desc: 'Eliminates lowest candidate each round until one wins', singleWinner: true },
                    { value: 'STV', label: 'Single Transferable Vote (STV)', desc: 'Multi-winner variant of IRV', singleWinner: false, disabled: true },
                    { value: 'BORDA', label: 'Borda Count', desc: 'Points-based system', singleWinner: true, disabled: true },
                    { value: 'APPROVAL', label: 'Approval Voting', desc: 'Vote for as many as you like', singleWinner: true, disabled: true },
                  ].map(method => (
                    <label
                      key={method.value}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all block ${
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
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{method.label}</div>
                          <div className="text-sm text-slate-500">{method.desc}</div>
                          {method.disabled && <div className="text-xs text-brand-600 mt-1">Coming soon</div>}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Winners Count (for STV) */}
              {votingMethod === 'STV' && (
                <div>
                  <label htmlFor="winnersCount" className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Winners <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="winnersCount"
                    min="2"
                    max="10"
                    value={winnersCount}
                    onChange={(e) => setWinnersCount(parseInt(e.target.value) || 2)}
                    className="input w-32"
                  />
                  <p className="text-sm text-slate-500 mt-1">How many candidates should be elected?</p>
                </div>
              )}

              {/* Ballot Style */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ballot Style <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${
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
                    <div className="text-3xl mb-2">↕️</div>
                    <div className="font-medium text-slate-900">Drag & Drop</div>
                    <div className="text-xs text-slate-500">Reorder by dragging</div>
                  </label>
                  <label
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${
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
                    <div className="text-3xl mb-2">🔢</div>
                    <div className="font-medium text-slate-900">Number Grid</div>
                    <div className="text-xs text-slate-500">Click to assign ranks</div>
                  </label>
                </div>
              </div>

              {/* Method validation error */}
              {methodError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm">{methodError}</p>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button onClick={() => setStep(1)} className="btn-ghost">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="btn-primary"
                >
                  Next: Add Options →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Options */}
        {step === 3 && (
          <div className="card p-6">
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">Add Options</h1>
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
                <button onClick={() => setStep(2)} className="btn-ghost">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!canProceedStep3}
                  className="btn-primary"
                >
                  Next: Access Control →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* T2.3: Step 4 - Access Control */}
        {step === 4 && (
          <div className="card p-6">
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">Access Control</h1>
            <p className="text-slate-600 mb-6">Configure who can vote and how.</p>

            <div className="space-y-6">
              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Who can vote? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    {
                      value: 'PUBLIC_LINK',
                      label: 'Anyone with the link',
                      desc: 'Public contest, no restrictions',
                      icon: '🔗'
                    },
                    {
                      value: 'RESTRICTED_LIST',
                      label: 'Specific voter IDs only',
                      desc: 'Only pre-approved voters can participate',
                      icon: '📋'
                    },
                    {
                      value: 'ORGANIZER_ONLY',
                      label: 'Testing mode',
                      desc: 'Only you can vote (for testing)',
                      icon: '🔒'
                    },
                  ].map(vis => (
                    <label
                      key={vis.value}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all block ${
                        visibility === vis.value
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={vis.value}
                        checked={visibility === vis.value}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{vis.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{vis.label}</div>
                          <div className="text-sm text-slate-500">{vis.desc}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                          visibility === vis.value
                            ? 'border-brand-500 bg-brand-500'
                            : 'border-slate-300'
                        }`}>
                          {visibility === vis.value && (
                            <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="6" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Allowed voters list */}
              {visibility === 'RESTRICTED_LIST' && (
                <div>
                  <label htmlFor="allowedVoters" className="block text-sm font-medium text-slate-700 mb-2">
                    Allowed Voter IDs <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="allowedVoters"
                    value={allowedVoters}
                    onChange={(e) => setAllowedVoters(e.target.value)}
                    className="input min-h-[150px] font-mono text-sm"
                    placeholder="Enter voter IDs, one per line:&#10;student123&#10;faculty@university.edu&#10;john.doe@company.com"
                  />
                  <p className="text-sm text-slate-600 mt-2">
                    {allowedVoters.split('\n').filter(v => v.trim()).length} voter(s) will be allowed
                  </p>
                </div>
              )}

              {/* Additional settings */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireVoterId}
                    onChange={(e) => setRequireVoterId(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-brand-500 focus:ring-brand-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">Require Voter ID</div>
                    <div className="text-sm text-slate-500">Ask all voters to enter an ID (email, student ID, etc.)</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deduplicationEnabled}
                    onChange={(e) => setDeduplicationEnabled(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-brand-500 focus:ring-brand-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">Block Duplicate Votes</div>
                    <div className="text-sm text-slate-500">Prevent voting from the same device multiple times</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowPartialRanking}
                    onChange={(e) => setAllowPartialRanking(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-brand-500 focus:ring-brand-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">Allow Partial Ranking</div>
                    <div className="text-sm text-slate-500">Voters can rank only some options instead of all</div>
                  </div>
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button onClick={() => setStep(3)} className="btn-ghost">
                  ← Back
                </button>
                <button
                  onClick={handlePublish}
                  disabled={loading || !canProceedStep4}
                  className="btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></span>
                      Creating Contest...
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
        {step >= 2 && step < 4 && (
          <div className="mt-6 card p-4 bg-slate-50">
            <div className="text-sm font-medium text-slate-700 mb-3">Contest Summary</div>
            <div className="space-y-2 text-sm text-slate-600">
              <div><strong>Title:</strong> {title || '(not set)'}</div>
              <div><strong>Slug:</strong> {slugFinal || '(not set)'}</div>
              <div><strong>Type:</strong> {contestType}</div>
              {step >= 3 && (
                <>
                  <div><strong>Method:</strong> {votingMethod}</div>
                  <div><strong>Ballot:</strong> {ballotStyle === 'DRAG' ? 'Drag & Drop' : 'Number Grid'}</div>
                  {votingMethod === 'STV' && <div><strong>Winners:</strong> {winnersCount}</div>}
                </>
              )}
              {step === 4 && (
                <>
                  <div><strong>Options:</strong> {options.filter(o => o.name.trim()).length}</div>
                  <div><strong>Access:</strong> {visibility.replace('_', ' ')}</div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CreateContestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <CreateContestForm />
    </Suspense>
  );
}
