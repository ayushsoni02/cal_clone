'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createEventType, updateEventType } from '@/lib/api';
import { slugify } from '@/lib/utils';

interface EventTypeFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    id: number;
    title: string;
    description: string | null;
    duration: number;
    bufferMinutes?: number;
    slug: string;
  };
}

const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
  { value: 90, label: '90 minutes' },
  { value: 120, label: '120 minutes' },
];

export default function EventTypeForm({ mode, initialData }: EventTypeFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [duration, setDuration] = useState(initialData?.duration || 30);
  const [bufferMinutes, setBufferMinutes] = useState(initialData?.bufferMinutes || 0);
  const [questions, setQuestions] = useState<{ id: string; label: string; required: boolean }[]>(
    (initialData as any)?.questions || []
  );
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);

  // Auto-generate slug from title (only if user hasn't manually edited it)
  useEffect(() => {
    if (mode === 'create' && !slugManuallyEdited) {
      setSlug(slugify(title));
    }
  }, [title, mode, slugManuallyEdited]);

  const validateSlug = (value: string): boolean => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!value) {
      setSlugError('Slug is required');
      return false;
    }
    if (!slugRegex.test(value)) {
      setSlugError('Only lowercase letters, numbers, and hyphens allowed');
      return false;
    }
    setSlugError(null);
    return true;
  };

  const handleSlugChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(cleaned);
    setSlugManuallyEdited(true);
    if (cleaned) validateSlug(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!validateSlug(slug)) return;

    setSubmitting(true);

    try {
      const data = {
        title: title.trim(),
        description: description.trim() || null,
        duration,
        bufferMinutes,
        questions,
        slug,
      };

      if (mode === 'create') {
        await createEventType(data);
      } else if (initialData) {
        await updateEventType(initialData.id, data);
      }

      router.push('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setSlugError('An event type with this slug already exists');
      } else {
        setError(err.response?.data?.error || 'Something went wrong');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now().toString(), label: '', required: false }]);
  };

  const updateQuestion = (id: string, field: 'label' | 'required', value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* General error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Title */}
      <div className="mb-5">
        <label htmlFor="title" className="block text-sm font-medium text-[var(--cal-text)] mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quick Chat"
          required
          className="w-full h-10 px-3.5 border border-gray-300 rounded-md text-sm text-[var(--cal-text)] placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--cal-brand)] focus:ring-offset-2 outline-none transition-shadow"
        />
      </div>

      {/* Description */}
      <div className="mb-5">
        <label htmlFor="description" className="block text-sm font-medium text-[var(--cal-text)] mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A quick video meeting"
          rows={3}
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-sm text-[var(--cal-text)] placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--cal-brand)] focus:ring-offset-2 outline-none transition-shadow resize-none"
        />
      </div>

      {/* Duration */}
      <div className="mb-5 flex gap-4">
        <div className="flex-1">
          <label htmlFor="duration" className="block text-sm font-medium text-[var(--cal-text)] mb-1.5">
            Duration <span className="text-red-500">*</span>
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-10 px-3.5 border border-gray-300 rounded-md text-sm text-[var(--cal-text)] bg-[var(--cal-bg)] focus:ring-2 focus:ring-[var(--cal-brand)] focus:ring-offset-2 outline-none transition-shadow appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
          >
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="buffer" className="block text-sm font-medium text-[var(--cal-text)] mb-1.5">
            Buffer Time
          </label>
          <select
            id="buffer"
            value={bufferMinutes}
            onChange={(e) => setBufferMinutes(Number(e.target.value))}
            className="w-full h-10 px-3.5 border border-gray-300 rounded-md text-sm text-[var(--cal-text)] bg-[var(--cal-bg)] focus:ring-2 focus:ring-[var(--cal-brand)] focus:ring-offset-2 outline-none transition-shadow appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
          >
            <option value={0}>0 minutes (No buffer)</option>
            <option value={5}>5 minutes before/after</option>
            <option value={10}>10 minutes before/after</option>
            <option value={15}>15 minutes before/after</option>
            <option value={30}>30 minutes before/after</option>
          </select>
        </div>
      </div>

      {/* URL Slug */}
      <div className="mb-6">
        <label htmlFor="slug" className="block text-sm font-medium text-[var(--cal-text)] mb-1.5">
          URL Slug <span className="text-red-500">*</span>
        </label>
        <div className="flex rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-[var(--cal-brand)] focus-within:ring-offset-2 transition-shadow">
          <span className="inline-flex items-center px-3.5 bg-gray-50 text-sm text-gray-500 border-r border-gray-300 select-none whitespace-nowrap">
            cal.com/admin/
          </span>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="quick-chat"
            required
            className="flex-1 h-10 px-3.5 text-sm text-[var(--cal-text)] placeholder:text-gray-400 outline-none"
          />
        </div>
        {slugError && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {slugError}
          </p>
        )}
        {slug && !slugError && (
          <p className="mt-1.5 text-xs text-gray-400">
            Public link: <span className="font-mono">localhost:3000/admin/{slug}</span>
          </p>
        )}
      </div>

      {/* Custom Questions */}
      <div className="mb-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-[var(--cal-text)]">Custom Questions</h3>
            <p className="text-xs text-gray-500 mt-1">Ask guests for more information when they book.</p>
          </div>
          <button
            type="button"
            onClick={addQuestion}
            className="text-sm font-medium text-[var(--cal-brand)] hover:text-gray-800"
          >
            + Add question
          </button>
        </div>

        {questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div key={q.id} className="flex gap-3 items-start bg-gray-50 p-3 rounded-md border border-gray-200">
                <div className="flex-1">
                  <input
                    type="text"
                    value={q.label}
                    onChange={(e) => updateQuestion(q.id, 'label', e.target.value)}
                    placeholder="E.g. What is your phone number?"
                    required
                    className="w-full h-9 px-3 border border-gray-300 rounded-md text-sm text-[var(--cal-text)] outline-none focus:border-[var(--cal-brand)]"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`req-${q.id}`}
                      checked={q.required}
                      onChange={(e) => updateQuestion(q.id, 'required', e.target.checked)}
                      className="rounded border-gray-300 text-[var(--cal-brand)] focus:ring-[var(--cal-brand)]"
                    />
                    <label htmlFor={`req-${q.id}`} className="text-xs text-gray-600">Required</label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded bg-white border border-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <p className="text-sm text-gray-500">No custom questions added.</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 h-10 px-5 bg-[var(--cal-brand)] text-[var(--cal-brand-text)] text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting && (
            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {submitting
            ? (mode === 'create' ? 'Creating...' : 'Saving...')
            : (mode === 'create' ? 'Create event type' : 'Save changes')
          }
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="h-10 px-5 text-sm font-medium text-[var(--cal-text-muted)] bg-[var(--cal-bg)] border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
