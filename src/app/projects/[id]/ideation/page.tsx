import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '../../../../components/header';
import { Footer } from '../../../../components/footer';
import { projects } from '../../../../data/projects';
import { Lightbulb, ChevronRight } from 'lucide-react';

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default function ProjectIdeationPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Idea</h1>
              <p className="text-gray-600">Share your thoughts and help shape the {project.title}</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-12 text-center">
              <p className="text-gray-500 italic">Idea submission form coming soon...</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
