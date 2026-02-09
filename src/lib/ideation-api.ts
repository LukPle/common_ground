import type { LimitationCheck } from '@/types/limitation_check';

export interface GenerateImageParams {
  prompt: string;
  projectId: string;
  originalImage: string;
}

export async function generateImage(
  params: GenerateImageParams
): Promise<{ imageUrl: string }> {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(
      data.message || 'Failed to generate image. Please try again or adjust your prompt.'
    );
  }
  return { imageUrl: data.imageUrl };
}

export interface AnalyzeIdeaParams {
  prompt: string;
  limitations: string[];
  projectTitle: string;
  projectDescription: string;
}

export interface AnalyzeIdeaResult {
  realityCheckResults: LimitationCheck[];
  suggestedTitle: string;
  suggestedDescription: string;
}

export async function analyzeIdea(
  params: AnalyzeIdeaParams
): Promise<AnalyzeIdeaResult> {
  const response = await fetch('/api/analyze-idea', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error || 'The AI analysis failed.');
  }
  return {
    realityCheckResults: data.realityCheckResults,
    suggestedTitle: data.suggestedTitle,
    suggestedDescription: data.suggestedDescription,
  };
}

export async function moderateContent(
  title: string,
  description: string
): Promise<{ isSafe: true } | { isSafe: false; reason: string }> {
  const response = await fetch('/api/moderate-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  const data = await response.json();
  if (!response.ok) {
    return {
      isSafe: false,
      reason: data.reason || 'Your content could not be verified. Please try again.',
    };
  }
  return { isSafe: true };
}

export interface SubmitIdeaParams {
  title: string;
  description: string;
  generatedImage: string;
  project_reference: string;
}

export async function submitIdea(
  params: SubmitIdeaParams
): Promise<{ ideaId: number }> {
  const response = await fetch('/api/submit-idea', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit idea.');
  }
  return { ideaId: data.ideaId };
}
