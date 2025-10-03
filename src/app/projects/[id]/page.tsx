import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { projects } from '../../../data/projects';
import { ArrowRight, Check, ChevronRight, Users, Clock, TrendingUp, Lightbulb } from 'lucide-react';

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

  const now = new Date();
  const deadline = new Date(project.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link 
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors w-fit"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image 
          src={project.image} 
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20`} />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-16">
          <div className="text-white max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto w-full">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
              {project.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-black mt-4 drop-shadow-lg">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mt-2 drop-shadow-md">
              {project.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 divide-y divide-gray-200">
          
          {/* At-a-Glance Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <div className="p-6 flex items-center gap-4">
              <Users className={`w-8 h-8 ${project.color.replace('from-', 'text-').split(' ')[0]}`} />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-semibold text-gray-900">{project.status}</p>
              </div>
            </div>
            <div className="p-6 flex items-center gap-4 sm:border-l sm:border-r">
              <Clock className={`w-8 h-8 ${daysLeft > 30 ? 'text-emerald-600' : daysLeft > 7 ? 'text-amber-600' : 'text-red-600'}`} />
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="text-lg font-semibold text-gray-900">
                  {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}
                </p>
              </div>
            </div>
            <div className="p-6 flex items-center gap-4">
               <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Community Input</p>
                <p className="text-lg font-semibold text-gray-900">{project.ideas} ideas submitted</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 sm:p-10 space-y-10">
            {/* Full Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {project.fullDescription}
              </p>
            </div>

            {/* Key Objectives (Bento Grid) */}
            {project.limitations && project.limitations.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Objectives</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.limitations.map((objective, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3 transition-all hover:border-blue-500 hover:bg-blue-50">
                      <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Call to Action */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
              <Lightbulb className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Have an Idea?</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your perspective is crucial. Share your vision for the park and help shape this project's future.
              </p>
              <Link href={`/projects/${project.id}/ideation`}>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center gap-2">
                  Submit Your Idea
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
