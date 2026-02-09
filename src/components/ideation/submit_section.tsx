'use client';

import {
  ArrowRight,
  CircleCheck,
  CircleCheckBig,
  Loader2,
  Send,
  Share2,
} from 'lucide-react';
import Link from 'next/link';

interface SubmitSectionProps {
  submissionStatus: 'idle' | 'success' | 'error';
  isSubmitting: boolean;
  isSubmitEnabled: boolean;
  moderationIssue: string | null;
  projectReference: string;
  copySuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onShare: () => void;
}

export function SubmitSection({
  submissionStatus,
  isSubmitting,
  isSubmitEnabled,
  moderationIssue,
  projectReference,
  copySuccess,
  onSubmit,
  onShare,
}: SubmitSectionProps) {
  if (submissionStatus === 'success') {
    return (
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 text-center">
        <CircleCheckBig className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Your idea has been successfully submitted and is now visible on the
          project page.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/projects/${projectReference}`}>
            <span className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center gap-2">
              View Project Page
              <ArrowRight className="w-5 h-5" />
            </span>
          </Link>
          <button
            onClick={onShare}
            className={`bg-white px-6 py-3 rounded-lg font-semibold transition-all shadow-sm border inline-flex items-center gap-2 ${copySuccess
                ? 'border-emerald-200 text-emerald-700'
                : 'text-gray-800 border-gray-200 hover:bg-gray-100'
              }`}
          >
            {copySuccess ? (
              <>
                <CircleCheck className="w-5 h-5" />
                Copied to clipboard!
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Share Your Idea
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      {moderationIssue && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
          <p className="text-red-700 text-sm font-medium">{moderationIssue}</p>
        </div>
      )}

      {submissionStatus === 'error' && !moderationIssue && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
          <p className="text-red-700 text-sm font-medium">
            Submission failed. Please try again.
          </p>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={!isSubmitEnabled}
        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" /> Submit Idea
          </>
        )}
      </button>
    </div>
  );
}
