'use client';

import { LimitationCheckCard } from '@/components/ideation/limitation_check_card';
import type { LimitationCheck } from '@/types/limitation_check';
import type { Project } from '@/types/project';
import { Loader2, Sparkles } from 'lucide-react';

interface RealityCheckStepProps {
  project: Project;
  isCheckingReality: boolean;
  realityCheckResults: LimitationCheck[] | null;
  realityCheckError: string | null;
  onAnalyze: () => void;
}

export function RealityCheckStep({
  project,
  isCheckingReality,
  realityCheckResults,
  realityCheckError,
  onAnalyze,
}: RealityCheckStepProps) {
  const showAnalyzeButton =
    !isCheckingReality &&
    !realityCheckResults &&
    !realityCheckError;

  return (
    <>
      {showAnalyzeButton && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <p className="text-blue-900 text-sm mb-4">
              Ready to analyze your idea against the project's limitations?
            </p>
            <button
              onClick={onAnalyze}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Analyze Idea
            </button>
          </div>

          {(!project?.limitations || project.limitations.length === 0) && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-gray-600 text-xs">
                Note: This project has no specific limitations to check against,
                but analysis will still generate submission details.
              </p>
            </div>
          )}
        </div>
      )}

      {isCheckingReality && (
        <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          <p className="text-gray-600 text-sm">
            AI is checking your idea against project limitations...
          </p>
        </div>
      )}

      {realityCheckError && (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800">{realityCheckError}</p>
        </div>
      )}

      {realityCheckResults && (
        <div className="space-y-3">
          {realityCheckResults.map((result, index) => (
            <LimitationCheckCard key={index} result={result} />
          ))}
          <p className="text-xs text-gray-500 mt-2">
            Our AI reviewed your idea against the project's limitations. This is
            just a suggestion, as you can still submit your idea.
          </p>
        </div>
      )}
    </>
  );
}
