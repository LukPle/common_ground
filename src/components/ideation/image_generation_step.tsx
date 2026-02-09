'use client';

import {
  ChevronDown,
  ImageIcon,
  Loader2,
  RotateCw,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';

interface ImageStepProps {
  projectImage: string;
  projectTitle: string;
  idea: string;
  setIdea: (v: string) => void;
  isGenerating: boolean;
  generationError: string | null;
  generatedImage: string | null;
  baseImage: 'original' | 'last';
  setBaseImage: (v: 'original' | 'last') => void;
  showBaseSelector: boolean;
  onGenerate: (e: React.FormEvent) => void;
  onOpenModal: (url: string) => void;
}

export function ImageStep({
  projectImage,
  projectTitle,
  idea,
  setIdea,
  isGenerating,
  generationError,
  generatedImage,
  baseImage,
  setBaseImage,
  showBaseSelector,
  onGenerate,
  onOpenModal,
}: ImageStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-gray-500" />
          Original Design
        </h3>
        <div
          className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 cursor-pointer"
          onClick={() => onOpenModal(projectImage)}
        >
          <div className="aspect-[16/10] w-full">
            <img
              src={projectImage}
              alt={projectTitle}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <form onSubmit={onGenerate}>
        <div>
          <label
            htmlFor="idea"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Describe Your Enhancement
          </label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., 'Add a children's playground with natural materials...'"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            rows={4}
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            Be specific. Your description will guide the AI in generating the new
            vision.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            type="submit"
            disabled={!idea.trim() || isGenerating}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>Generating Vision ...</>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate{' '}
                {showBaseSelector ? 'Next' : 'Updated'} Vision
              </>
            )}
          </button>

          {showBaseSelector && !isGenerating && (
            <div className="relative w-full sm:w-auto">
              <select
                value={baseImage}
                onChange={(e) =>
                  setBaseImage(e.target.value as 'original' | 'last')
                }
                className="appearance-none h-full w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <option value="original">From Original Image</option>
                <option value="last">From Last Generation</option>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>
      </form>

      {isGenerating && (
        <div className="mt-8 p-8 bg-gray-50 border border-gray-200 rounded-xl text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Creating Your Vision...
          </h3>
          <p className="text-gray-600 text-sm">
            Our AI is generating a visual representation of your idea. This can
            take up to 30 seconds.
          </p>
        </div>
      )}

      {generationError && !isGenerating && (
        <div className="mt-8 p-8 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <TriangleAlert className="w-8 h-8 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            Image Generation Failed
          </h3>
          <p className="text-amber-800 text-sm max-w-md mx-auto">
            This can happen if the request is unclear or violates safety
            policies. Please try refining your prompt or click to try again.
          </p>
          <button
            onClick={(e) => onGenerate(e as React.FormEvent)}
            className="mt-6 bg-white border border-amber-300 rounded-full p-2 hover:bg-amber-100/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            aria-label="Retry image generation"
          >
            <RotateCw className="w-5 h-5 text-amber-600" />
          </button>
        </div>
      )}

      {generatedImage && !isGenerating && !generationError && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Enhanced Design
          </h3>
          <div
            className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 mb-8 cursor-pointer"
            onClick={() => onOpenModal(generatedImage)}
          >
            <div className="aspect-[16/10] w-full">
              <img
                src={generatedImage}
                alt="Generated project vision based on user idea"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
