import { MegaphoneOff } from 'lucide-react';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { Hero } from '../components/hero';
import { HowTo } from '../components/how_to';
import { ProjectCard } from '../components/project_card';
import { fetchProjects } from '../lib/supabase/queries.server';

export default async function Home() {
  const projects = await fetchProjects();
  const now = new Date();
  const activeProjects = projects.filter(project => new Date(project.deadline) >= now);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />

      <HowTo />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pt-24 md:pb-24">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Active Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover ongoing initiatives and contribute your ideas.
          </p>
        </div>

        {activeProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12">
            <MegaphoneOff className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Active Projects Right Now</h3>
            <p className="mt-1 text-gray-500">
              New community initiatives will be posted here, please check back soon.
            </p>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}
