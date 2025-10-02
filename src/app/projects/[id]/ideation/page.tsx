'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '../../../../components/header';
import { Footer } from '../../../../components/footer';
import { projects } from '../../../../data/projects';
import { Lightbulb, ChevronRight, Send, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function ProjectIdeationPage({ params }: { params: { id: string } }) {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const project = projects.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Create a prompt that describes the enhancement to be applied to the original image
      const prompt = `${idea}. Enhance this ${project.title} design by integrating these improvements while maintaining the original architectural character and composition as close as possible.`;
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          projectId: project.id,
          originalImage: project.image 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error('Error generating image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href={`/projects/${params.id}`}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Project
          </Link>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhance the Design</h1>
              <p className="text-gray-600">Share your ideas to improve and enhance the {project.title}</p>
            </div>

            {/* Current Project Image */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Original Design (Base Image)
              </h3>
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <div className="aspect-[16/10] w-full">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
            
            {/* Idea Submission Form */}
            <form onSubmit={handleSubmitIdea} className="space-y-6">
              <div>
                <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Idea
                </label>
                <textarea
                  id="idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe how you'd enhance this design... (e.g., 'Add a children's playground with natural materials and water features that connect to the stormwater management system, integrate more green roofs, or include solar panels')"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  rows={4}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Be specific about enhancements, additions, or modifications to the existing design.
                </p>
              </div>

              <button
                type="submit"
                disabled={!idea.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Vision...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Updated Vision
                  </>
                )}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Generated Image Display */}
            {generatedImage && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Enhanced Design
                </h3>
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-[16/10] w-full">
                    <img 
                      src={generatedImage} 
                      alt="Generated project vision"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 text-sm font-medium">
                    ✨ Your enhancement has been applied! This shows how your ideas enhance the original design.
                  </p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isGenerating && (
              <div className="mt-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl text-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Your Vision</h3>
                <p className="text-gray-600">
                  Our AI is generating a visual representation of your idea...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
