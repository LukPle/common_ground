'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  analyzeIdea,
  generateImage,
  moderateContent,
  submitIdea,
} from '@/lib/ideation-api';
import { fetchProjectByIdClient } from '@/lib/supabase/queries.client';
import type { LimitationCheck } from '@/types/limitation_check';
import type { Project } from '@/types/project';

export function useIdeationState(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [baseImage, setBaseImage] = useState<'original' | 'last'>('original');
  const [showBaseSelector, setShowBaseSelector] = useState(false);

  const [isCheckingReality, setIsCheckingReality] = useState(false);
  const [realityCheckResults, setRealityCheckResults] = useState<
    LimitationCheck[] | null
  >(null);
  const [realityCheckError, setRealityCheckError] = useState<string | null>(
    null
  );
  const [title, setTitle] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [moderationIssue, setModerationIssue] = useState<string | null>(null);
  const [newIdeaId, setNewIdeaId] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      const fetched = await fetchProjectByIdClient(projectId);
      if (!cancelled) {
        if (!fetched) {
          setPageError(
            'Project not found. It may have been moved or deleted.'
          );
        } else {
          setProject(fetched);
        }
        setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const handleGenerateVision = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!idea.trim() || !project) return;
      setIsGenerating(true);
      setGenerationError(null);
      setRealityCheckResults(null);
      setTitle('');
      setSubmissionStatus('idle');
      try {
        const sourceImage =
          baseImage === 'last' && generatedImage
            ? generatedImage
            : project.image;
        const prompt = `${idea}. Enhance this ${project.title} design by integrating these improvements while maintaining the original architectural character and composition as close as possible.`;
        const { imageUrl } = await generateImage({
          prompt,
          projectId: project.id,
          originalImage: sourceImage,
        });
        setGeneratedImage(imageUrl);
        setBaseImage('last');
        setPromptHistory((prev) => [...prev, idea]);
        setShowBaseSelector(true);
        setIdea('');
      } catch (err: unknown) {
        setGenerationError(
          err instanceof Error ? err.message : 'An unknown error occurred.'
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [
      idea,
      project,
      baseImage,
      generatedImage,
    ]
  );

  const handleAnalyzeIdea = useCallback(async () => {
    if (!generatedImage || !project || promptHistory.length === 0) return;
    setIsCheckingReality(true);
    setRealityCheckError(null);
    setRealityCheckResults(null);
    setTitle('');
    setSubmissionDescription('');
    try {
      const result = await analyzeIdea({
        prompt: promptHistory.join(' | '),
        limitations: project.limitations || [],
        projectTitle: project.title,
        projectDescription: project.short_description,
      });
      setRealityCheckResults(result.realityCheckResults);
      setTitle(result.suggestedTitle);
      setSubmissionDescription(result.suggestedDescription);
    } catch (error: unknown) {
      setRealityCheckError(
        error instanceof Error ? error.message : 'The AI analysis failed.'
      );
      setTitle('A new vision for ' + project.title);
      setSubmissionDescription(promptHistory[promptHistory.length - 1] || '');
    } finally {
      setIsCheckingReality(false);
    }
  }, [generatedImage, project, promptHistory]);

  const handleSubmitToDatabase = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !title.trim() ||
        !submissionDescription.trim() ||
        !generatedImage ||
        !project
      )
        return;
      setIsSubmitting(true);
      setModerationIssue(null);
      setSubmissionStatus('idle');
      try {
        const moderation = await moderateContent(title, submissionDescription);
        if (!moderation.isSafe) {
          setModerationIssue(moderation.reason);
          setSubmissionStatus('error');
          return;
        }
        const { ideaId } = await submitIdea({
          title,
          description: submissionDescription,
          generatedImage,
          project_reference: project.reference,
        });
        setNewIdeaId(ideaId);
        setSubmissionStatus('success');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Submission failed';
        console.error('Submission failed', err);
        setSubmissionStatus('error');
        setModerationIssue(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, submissionDescription, generatedImage, project]
  );

  const handleShare = useCallback(() => {
    if (!project || !newIdeaId) return;
    const shareUrl = `${window.location.origin}/projects/${project.reference}/ideas/${newIdeaId}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => setCopySuccess(true))
      .catch((err) => console.error('Failed to copy link:', err));
  }, [project, newIdeaId]);

  const openModal = useCallback((url: string) => setModalImageSrc(url), []);
  const closeModal = useCallback(() => setModalImageSrc(null), []);

  const isStep1Complete = !!generatedImage;
  const isStep2Active = isStep1Complete && !isGenerating;
  const isStep2Complete =
    isStep1Complete &&
    (!isCheckingReality &&
      (!!realityCheckResults ||
        !!realityCheckError ||
        !project?.limitations ||
        project.limitations.length === 0));
  const isStep3Active = isStep2Complete;
  const isStep3Complete = submissionStatus === 'success';
  const isSubmitEnabled =
    isStep3Active &&
    !!title.trim() &&
    !!submissionDescription.trim() &&
    !isSubmitting;

  return {
    project,
    isLoading,
    pageError,
    idea,
    setIdea,
    isGenerating,
    generatedImage,
    generationError,
    promptHistory,
    baseImage,
    setBaseImage,
    showBaseSelector,
    isCheckingReality,
    realityCheckResults,
    realityCheckError,
    title,
    setTitle,
    submissionDescription,
    setSubmissionDescription,
    isSubmitting,
    submissionStatus,
    moderationIssue,
    newIdeaId,
    copySuccess,
    modalImageSrc,
    handleGenerateVision,
    handleAnalyzeIdea,
    handleSubmitToDatabase,
    handleShare,
    openModal,
    closeModal,
    isStep1Complete,
    isStep2Active,
    isStep2Complete,
    isStep3Active,
    isStep3Complete,
    isSubmitEnabled,
  };
}
