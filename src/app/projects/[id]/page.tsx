import { ArrowRight, Check, Clock, Lightbulb, TrendingUp, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '../../../components/breadcrumbs';
import { Footer } from '../../../components/footer';
import { Header } from '../../../components/header';
import { IdeaList } from '../../../components/idea_list';
import { fetchIdeaCountForProject, fetchIdeasForProject, fetchProjectById, fetchProjectIds } from '../../../lib/supabase/queries.server';
import { getProjectStatus } from '../../../lib/utils';

export async function generateStaticParams() {
  const projects = await fetchProjectIds();

  return projects.map((project) => ({
    id: project.reference,
  }));
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const projectDataPromise = fetchProjectById(params.id);
  const ideaCountPromise = fetchIdeaCountForProject(params.id);
  const ideasPromise = fetchIdeasForProject(params.id);

  const [project, ideaCount, ideas] = await Promise.all([
    projectDataPromise,
    ideaCountPromise,
    ideasPromise,
  ]);

  if (!project) {
    notFound();
  }

  const now = new Date();
  const deadline = new Date(project.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const status = getProjectStatus(project.deadline);

  const breadcrumbItems = [
    { label: 'Projects', href: '/' },
    { label: project.title },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

        <div className="absolute inset-0 flex flex-col justify-end pb-16">
          <div className="text-white max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto w-full">
            <span className="bg-white/20 backdrop-blur-2xl border border-white/20 px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
              {project.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-black mt-4 drop-shadow-lg">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mt-2 drop-shadow-md">
              {project.short_description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {/* At-a-Glance Info Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 py-2 sm:gap-6 sm:grid-cols-3">
            <div className="py-4 flex items-center gap-4">
              <Users className={`w-8 h-8`} />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-semibold text-gray-900">{status}</p>
              </div>
            </div>
            <div className="py-4 flex items-center gap-4">
              <Clock className={`w-8 h-8 ${daysLeft > 30 ? 'text-emerald-600' : daysLeft > 7 ? 'text-amber-600' : 'text-red-600'}`} />
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="text-lg font-semibold text-gray-900">
                  {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}
                </p>
              </div>
            </div>
            <div className="py-4 flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Community Input</p>
                <p className="text-lg font-semibold text-gray-900">{ideaCount} ideas submitted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-12 py-10 sm:px-6 lg:px-8">
        {/* Full Description */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">About This Project</h2>
          <p className="text-gray-600 leading-relaxed text-base">
            {project.full_description}
          </p>
        </div>

        {/* Limitations */}
        {project.limitations && project.limitations.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Limitations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.limitations.map((limitation, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3 transition-all">
                  <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{limitation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-blue-50 rounded-xl lg:rounded-full p-6 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <Lightbulb className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Have an Idea?</h3>
            <p className="text-gray-600 text-sm">
              Your perspective is crucial. Share your vision for the park and help shape this project's future.
            </p>
          </div>
          <Link href={`/projects/${project.reference}/ideation`} className="w-full lg:w-auto">
            <button className="w-full lg:w-auto bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all inline-flex items-center justify-center gap-2 flex-shrink-0">
              Submit Your Idea
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* Idea List */}
        {ideas && ideas.length > 0 && (
          <IdeaList ideas={ideas} ideaCount={ideaCount} />
        )}
      </div>

      <Footer />
    </div>
  );
}
