import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { projects } from '../../../data/projects';
import { Users, Calendar, MapPin, Lightbulb, ArrowRight, Check, ChevronRight } from 'lucide-react';

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Projects
          </Link>
        </div>
      </div>

      <div className="relative h-96 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`} />
        <Image 
          src={project.image} 
          alt={project.title}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
              {project.category}
            </span>
            <h1 className="text-5xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl text-white/90">{project.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 -mt-20 relative z-10">
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="text-xl font-bold text-gray-900">{project.participants}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Date(project.deadline).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-xl font-bold text-gray-900">{project.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
              <p className="text-gray-600 leading-relaxed">
                {project.fullDescription}
              </p>
            </div>

            {project.objectives && project.objectives.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Key Objectives</h3>
                <ul className="space-y-2">
                  {project.objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
            <Lightbulb className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Have an Idea?</h3>
            <p className="text-gray-600 mb-6">
              Share your vision for the park and help shape this project
            </p>
            <Link href={`/projects/${project.id}/ideation`}>
              <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center gap-2">
                Submit Your Idea
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
