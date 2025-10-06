import React from 'react';
import { Header } from '../components/header';
import { Hero } from '../components/hero';
import { ProjectCard } from '../components/project_card';
import { Footer } from '../components/footer';
import { fetchProjects } from '../lib/supabase/queries.server';

export default async function Home() {
  const projects = await fetchProjects();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Active Projects</h2>
          <p className="text-gray-600">Discover ongoing initiatives and contribute your ideas</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
