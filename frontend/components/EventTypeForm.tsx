'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createEventType, updateEventType } from '@/lib/api';

interface EventTypeFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    id: number;
    title: string;
    description: string | null;
    duration: number;
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function EventTypeForm({ mode, initialData }: EventTypeFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [duration, setDuration] = useState(initialData?.duration || 30);
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

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* General error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Title */}
      <div className="mb-5">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quick Chat"
          required
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-shadow"
        />
      </div>

      {/* Description */}
      <div className="mb-5">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A quick video meeting"
          rows={3}
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-shadow resize-none"
        />
      </div>

      {/* Duration */}
      <div className="mb-5">
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1.5">
          Duration <span className="text-red-500">*</span>
        </label>
        <select
          id="duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-shadow appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
        >
          {DURATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* URL Slug */}
      <div className="mb-6">
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1.5">
          URL Slug <span className="text-red-500">*</span>
        </label>
        <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-gray-900 transition-shadow">
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
            className="flex-1 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
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

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
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
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
