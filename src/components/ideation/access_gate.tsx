'use client';

import { Lock, Loader2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface AccessGateProps {
  onUnlocked: () => void;
}

export function AccessGate({ onUnlocked }: AccessGateProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = (await response.json()) as { error?: string; unlocked?: boolean };

      if (!response.ok) {
        setError(data.error ?? 'Could not unlock. Try again.');
        return;
      }

      onUnlocked();
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto text-center py-16 px-4">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access code required</h1>
      <p className="text-gray-600 mb-8">
        Enter the 6-character code to use the ideation demo.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.slice(0, 6))}
          maxLength={6}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="••••••"
          className="w-full text-center text-2xl tracking-[0.4em] font-mono border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting || code.trim().length !== 6}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium rounded-xl px-4 py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking…
            </>
          ) : (
            'Unlock'
          )}
        </button>
      </form>
    </div>
  );
}
