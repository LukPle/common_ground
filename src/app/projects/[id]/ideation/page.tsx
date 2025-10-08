'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '../../../../components/header';
import { Footer } from '../../../../components/footer';
import { Lightbulb, Loader2, Image as ImageIcon, Sparkles, Send, ChevronRight, TriangleAlert, RotateCw, X, CircleCheckBig, ArrowRight, CircleDotDashed } from 'lucide-react';
import { fetchProjectByIdClient } from '../../../../lib/supabase/queries.client';
import { Project } from '../../../../types/project';
import { Step } from '../../../../components/step';

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
  
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);

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
        body: JSON.stringify({ prompt, projectId: project.id, originalImage: project.image }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || 'Failed to generate image. Please try again or adjust your prompt.');
      }
      setGeneratedImage(data.imageUrl);

      try {
        const suggestionResponse = await fetch('/api/generate-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: idea }),
        });

        if (suggestionResponse.ok) {
          const suggestionData = await suggestionResponse.json();
          setTitle(suggestionData.suggestedTitle);
          setSubmissionDescription(suggestionData.suggestedDescription);
        } else {
          throw new Error("Failed to get AI suggestions.");
        }
      } catch (suggestionError) {
        console.error("Could not fetch suggestions, using fallback:", suggestionError);
        setTitle('A new vision for ' + project.title);
        setSubmissionDescription(idea);
      }

    } catch (err: any) {
      setGenerationError(err.message || 'An unknown error occurred.');
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
        body: JSON.stringify({ title, description: submissionDescription, generatedImage, project_reference: project.reference, user_id: userId }),
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

  const openModal = (imageUrl: string) => setModalImageSrc(imageUrl);
  const closeModal = () => setModalImageSrc(null);

  if (isLoading) { return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>; }
  if (pageError) { return <div className="min-h-screen bg-gray-50"><Header /><div className="text-center py-20 px-4"><h1 className="text-2xl font-bold text-red-600">Error</h1><p className="text-gray-600 mt-2">{pageError}</p><Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Go to Home</Link></div><Footer /></div>; }
  if (!project) { return <div>Project could not be loaded.</div>; }

  const isStep1Complete = !!generatedImage;
  const isStep2Active = isStep1Complete;
  const isStep2Complete = isStep1Complete;
  const isStep3Active = isStep2Complete;
  const isStep3Complete = submissionStatus === 'success';
  const isSubmitEnabled = isStep3Active && !!title.trim() && !!submissionDescription.trim() && !isSubmitting;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="bg-white border-b border-gray-200">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-gray-900 transition-colors">Projects</Link></li>
              <li><div className="flex items-center"><ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400" /><Link href={`/projects/${project.reference}`} className="ml-2 hover:text-gray-900 transition-colors">{project.title}</Link></div></li>
              <li><div className="flex items-center"><ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400" /><span className="ml-2 font-medium text-gray-800 truncate" title="Ideation">Ideation</span></div></li>
            </ol>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10">
            <div className="max-w-4xl mx-auto">
              
              <div className="text-center mb-16">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><Lightbulb className="w-8 h-8 text-blue-600" /></div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhance the Design</h1>
                <p className="text-gray-600">Share your idea to visually enhance the {project.title}</p>
              </div>

              <div>
                <Step number={1} title="Generate Your Vision" isLastStep={false} isComplete={isStep1Complete} isActive={true}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-gray-500" />Original Design</h3>
                      <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 cursor-pointer" onClick={() => openModal(project.image!)}><div className="aspect-[16/10] w-full"><img src={project.image!} alt={project.title} className="w-full h-full object-cover" /></div></div>
                    </div>
                    
                    <form onSubmit={handleGenerateVision}>
                      <div>
                        <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">Describe Your Enhancement</label>
                        <textarea id="idea" value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="e.g., 'Add a children's playground with natural materials...'" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all" rows={4} required />
                        <p className="text-xs text-gray-500 mt-2">Be specific. Your description will guide the AI in generating the new vision.</p>
                      </div>
                      <button type="submit" disabled={!idea.trim() || isGenerating} className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
                        {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Generating Vision...</>) : (<><Sparkles className="w-5 h-5" /> Generate Updated Vision</>)}
                      </button>
                    </form>

                    {isGenerating && (<div className="mt-8 p-8 bg-gray-50 border border-gray-200 rounded-xl text-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Your Vision...</h3><p className="text-gray-600 text-sm">Our AI is generating a visual representation of your idea. This can take up to 30 seconds.</p></div>)}
                    {generationError && !isGenerating && (<div className="mt-8 p-8 bg-amber-50 border border-amber-200 rounded-xl text-center"><TriangleAlert className="w-8 h-8 text-amber-500 mx-auto mb-4" /><h3 className="text-lg font-semibold text-amber-900 mb-2">Image Generation Failed</h3><p className="text-amber-800 text-sm max-w-md mx-auto">This can happen if the request is unclear or violates safety policies. Please try refining your prompt or click to try again.</p><button onClick={(e) => handleGenerateVision(e as any)} className="mt-6 bg-white border border-amber-300 rounded-full p-2 hover:bg-amber-100/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2" aria-label="Retry image generation"><RotateCw className="w-5 h-5 text-amber-600" /></button></div>)}
                    {generatedImage && !isGenerating && !generationError && (<div className="mt-10"><h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-600" />Enhanced Design</h3><div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 mb-8 cursor-pointer" onClick={() => openModal(generatedImage)}><div className="aspect-[16/10] w-full"><img src={generatedImage} alt="Generated project vision based on user idea" className="w-full h-full object-cover" /></div></div></div>)}
                  </div>
                </Step>

                <Step number={2} title="Reality Check" isLastStep={false} isComplete={isStep2Complete} isActive={isStep2Active}>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <CircleDotDashed className="w-6 h-6 text-gray-500"/>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Coming Soon
                        </h3>
                        <p className="text-gray-600 text-sm">
                          AI-powered checks against project limitations will be available here.
                        </p>
                      </div>
                    </div>
                  </div>
                </Step>

                <Step number={3} title="Add Your Details" isLastStep={true} isComplete={isStep3Complete} isActive={isStep3Active}>
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Idea Title</label>
                      <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., 'Eco-Friendly Playground & Solar Hub'" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                      <label htmlFor="submissionDescription" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea id="submissionDescription" value={submissionDescription} onChange={(e) => setSubmissionDescription(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" rows={4} required />
                    </div>
                  </form>
                </Step>

                <div>
                  {submissionStatus !== 'success' && (
                    <div className="text-center">
                      <button onClick={handleSubmitToDatabase} disabled={!isSubmitEnabled} className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>) : (<><Send className="w-5 h-5" /> Submit Idea</>)}
                      </button>
                    </div>
                  )}
                  {submissionStatus === 'success' && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 text-center">
                      <CircleCheckBig className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Your idea has been successfully submitted and is now visible on the project page.
                      </p>

                      <Link href={`/projects/${project.reference}`}>
                        <span className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center gap-2">
                          View Project Details
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      </Link>
                    </div>
                  )}
                  {submissionStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                      <p className="text-red-700 text-sm font-medium">
                        Submission failed. Please try again.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {modalImageSrc && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={closeModal}
        >
          <button 
            onClick={closeModal}
            className="absolute right-4 top-6 sm:top-6 sm:right-8 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-50 transition-colors"
            aria-label="Close image view"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <img 
              src={modalImageSrc}
              alt="Fullscreen view"
              className="block max-w-[95vw] max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
