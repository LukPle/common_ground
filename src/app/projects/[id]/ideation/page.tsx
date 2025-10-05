'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '../../../../components/header';
import { Footer } from '../../../../components/footer';
import { Lightbulb, ChevronRight, Loader2, Image as ImageIcon, Sparkles, Send } from 'lucide-react';
import { fetchProjectByIdClient, createIdea } from '../../../../lib/supabase/queries.client';
import { Project } from '../../../../types/project';
import { NewIdea } from '../../../../types/idea';

export default function ProjectIdeationPage({ params }: { params: { id: string } }) {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    const getProjectData = async () => {
      setIsLoading(true);
      const fetchedProject = await fetchProjectByIdClient(params.id);
      
      if (!fetchedProject) {
        setPageError('Project not found. It may have been moved or deleted.');
      } else {
        setProject(fetchedProject);
      }
      setIsLoading(false);
    };

    getProjectData();
  }, [params.id]);

  const handleGenerateVision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || !project) return;

    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedImage(null);
    setSubmissionStatus('idle');
    setTitle('');

    try {
      const prompt = `${idea}. Enhance this ${project.title} design by integrating these improvements while maintaining the original architectural character and composition as close as possible.`;
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          projectId: project.id,
          originalImage: project.image 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      setSubmissionDescription(idea);
    } catch (err: any) {
      setGenerationError(err.message || 'An unknown error occurred. Please try again.');
      console.error('Error generating image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitToDatabase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !submissionDescription.trim() || !generatedImage || !project) return;

    setIsSubmitting(true);
    setSubmissionStatus('idle');

    try {
      const userIdCookie = document.cookie.split('; ').find(row => row.startsWith('anonymous-user-id='));
      const userId = userIdCookie ? userIdCookie.split('=')[1] : 'unknown';

      const response = await fetch('/api/submit-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          description: submissionDescription,
          generatedImage: generatedImage,
          project_reference: project.reference,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit idea.');
      }
      
      setSubmissionStatus('success');

    } catch (err: any) {
      console.error("Submission failed", err);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20 px-4">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">{pageError}</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Go to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return <div>Project could not be loaded.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link 
            href={`/projects/${params.id}`}
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors w-fit"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Project Details
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhance the Design</h1>
              <p className="text-gray-600">Share your idea to visually enhance the {project.title}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-500" />
                Original Design
              </h3>
              <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200">
                <div className="aspect-[16/10] w-full">
                  <img src={project.image!} alt={project.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            
            <form onSubmit={handleGenerateVision} className="space-y-6">
              <div>
                <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">Describe Your Enhancement</label>
                <textarea
                  id="idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g., 'Add a children's playground with natural materials and water features...'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Be specific. Your description will guide the AI in generating the new vision.</p>
              </div>

              <button
                type="submit"
                disabled={!idea.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Generating Vision...</>) : (<><Sparkles className="w-5 h-5" /> Generate Updated Vision</>)}
              </button>
            </form>

            {generationError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm font-medium text-center">{generationError}</p>
              </div>
            )}
            
            {isGenerating && (
              <div className="mt-8 p-8 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Your Vision</h3>
                <p className="text-gray-600 text-sm">Our AI is generating a visual representation of your idea. This can take up to 30 seconds.</p>
              </div>
            )}

            {generatedImage && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Enhanced Design
                </h3>
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 mb-8">
                  <div className="aspect-[16/10] w-full">
                    <img 
                      src={generatedImage} 
                      alt="Generated project vision based on user idea"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {submissionStatus !== 'success' && (
                  <form onSubmit={handleSubmitToDatabase} className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Idea Title</label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., 'Eco-Friendly Playground & Solar Hub'"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="submissionDescription" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        id="submissionDescription"
                        value={submissionDescription}
                        onChange={(e) => setSubmissionDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!title.trim() || isSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>) : (<><Send className="w-5 h-5" /> Submit Idea</>)}
                    </button>
                  </form>
                )}
                
                {submissionStatus === 'success' && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                    <h3 className="text-green-800 font-semibold">Thank you!</h3>
                    <p className="text-green-700 text-sm">Your idea has been successfully submitted to the project.</p>
                  </div>
                )}
                {submissionStatus === 'error' && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                    <p className="text-red-700 text-sm font-medium">Submission failed. Please try again.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
