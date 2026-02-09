'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { AddDetailsStep } from '@/components/ideation/add_details_step';
import { FullscreenImage } from '@/components/ideation/full_screen_image';
import { ImageStep } from '@/components/ideation/image_generation_step';
import { RealityCheckStep } from '@/components/ideation/reality_check_step';
import { Step } from '@/components/ideation/step';
import { SubmitSection } from '@/components/ideation/submit_section';
import { PageLayout } from '@/components/page_layout';
import { useIdeationState } from '@/hooks/ideation_hooks';
import { Lightbulb, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function ProjectIdeationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const state = useIdeationState(id);

  const {
    project,
    isLoading,
    pageError,
    idea,
    setIdea,
    isGenerating,
    generatedImage,
    generationError,
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
  } = state;

  const breadcrumbItems = project
    ? [
      { label: 'Projects', href: '/' },
      { label: project.title, href: `/projects/${project.reference}` },
      { label: 'Ideation' },
    ]
    : [];

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex flex-grow items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (pageError) {
    return (
      <PageLayout>
        <div className="text-center py-20 px-4">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">{pageError}</p>
          <Link
            href="/"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Go to Home
          </Link>
        </div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <div>Project could not be loaded.</div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout>
        <main className="flex flex-col flex-grow">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-blue-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Craft Your Idea
                  </h1>
                  <p className="text-gray-600">
                    Create and share your vision for {project.title}
                  </p>
                </div>

                <div>
                  <Step
                    number={1}
                    title="Generate Your Vision"
                    isLastStep={false}
                    isComplete={isStep1Complete}
                    isActive={true}
                  >
                    <ImageStep
                      projectImage={project.image}
                      projectTitle={project.title}
                      idea={idea}
                      setIdea={setIdea}
                      isGenerating={isGenerating}
                      generationError={generationError}
                      generatedImage={generatedImage}
                      baseImage={baseImage}
                      setBaseImage={setBaseImage}
                      showBaseSelector={showBaseSelector}
                      onGenerate={handleGenerateVision}
                      onOpenModal={openModal}
                    />
                  </Step>

                  <Step
                    number={2}
                    title="Reality Check"
                    isLastStep={false}
                    isComplete={isStep2Complete}
                    isActive={isStep2Active}
                  >
                    <RealityCheckStep
                      project={project}
                      isCheckingReality={isCheckingReality}
                      realityCheckResults={realityCheckResults}
                      realityCheckError={realityCheckError}
                      onAnalyze={handleAnalyzeIdea}
                    />
                  </Step>

                  <Step
                    number={3}
                    title="Add Your Details"
                    isLastStep={true}
                    isComplete={isStep3Complete}
                    isActive={isStep3Active}
                  >
                    <AddDetailsStep
                      title={title}
                      setTitle={setTitle}
                      submissionDescription={submissionDescription}
                      setSubmissionDescription={setSubmissionDescription}
                    />
                  </Step>

                  <div>
                    <SubmitSection
                      submissionStatus={submissionStatus}
                      isSubmitting={isSubmitting}
                      isSubmitEnabled={isSubmitEnabled}
                      moderationIssue={moderationIssue}
                      projectReference={project.reference}
                      copySuccess={copySuccess}
                      onSubmit={handleSubmitToDatabase}
                      onShare={handleShare}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </PageLayout>

      {modalImageSrc && (
        <FullscreenImage imageSrc={modalImageSrc} onClose={closeModal} />
      )}
    </>
  );
}
