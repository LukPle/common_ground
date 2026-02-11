import { Breadcrumbs } from '@/components/core/breadcrumbs';
import { Card } from '@/components/core/card';
import { PageLayout } from '@/components/core/page_layout';
import { fetchIdeaCountForProject, fetchIdeasForProject, fetchProjectById, fetchProjectIds } from '@/lib/supabase/queries.server';
import { getProjectStatus, getRelativeTime } from '@/lib/utils';
import { ArrowRight, Check, Clock, Lightbulb, MapPin, TrendingUp, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const projects = await fetchProjectIds();

  return projects.map((project) => ({
    id: project.reference,
  }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const projectDataPromise = fetchProjectById(id);
  const ideaCountPromise = fetchIdeaCountForProject(id);
  const ideasPromise = fetchIdeasForProject(id);

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
    <PageLayout>
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
          <div className="text-white max-w-7xl px-4 md:px-8 mx-auto w-full">
            <span className="bg-white/20 backdrop-blur-2xl border border-white/20 px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
              {status}
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
      <div className="max-w-7xl mx-auto pb-12 sm:pb-16">

        {/* At-a-Glance Info Section */}
        <div className="w-full border-b border-gray-150 mb-4 md:mb-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3">

              <div className="py-6 px-4 md:px-8 flex items-center gap-4">
                <Users className="w-8 h-8 text-gray-900" />
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="text-lg font-semibold text-gray-900">{project.category}</p>
                </div>
              </div>

              <div className="p-6 px-4 md:px-8 flex items-center gap-4 border-y sm:border-y-0 sm:border-x border-gray-150">
                <Clock className={`w-8 h-8 ${daysLeft > 30 ? 'text-emerald-600' : daysLeft > 7 ? 'text-amber-600' : 'text-red-600'}`} />
                <div>
                  <p className="text-sm text-gray-600">Deadline</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}
                  </p>
                </div>
              </div>

              <div className="p-6 px-4 md:px-8 flex items-center gap-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Community Input</p>
                  <p className="text-lg font-semibold text-gray-900">{ideaCount} {ideaCount === 1 ? 'idea' : 'ideas'} submitted</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 space-y-12 md:space-y-16">
          {/* About Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Project</h2>
            <p className="text-gray-600 leading-relaxed text-base mb-4">
              {project.full_description}
            </p>
            {project.address && (
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0 text-gray-600 font-medium mt-1" />
                <span>{project.address}</span>
              </div>
            )}
          </div>

          {/* Limitations */}
          {project.limitations && project.limitations.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Limitations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.limitations.map((limitation, idx) => (
                  <div key={idx} className="bg-white border border-gray-150 rounded-xl p-4 flex items-start gap-3 transition-all">
                    <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{limitation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Get Active */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Active</h3>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">

                <div className="flex-shrink-0">
                  <Lightbulb className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                </div>

                <div className="flex-grow text-left">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Have an Idea?
                  </h3>
                  <p className="text-gray-600 text-sm max-w-xl">
                    Create your own vision for the project and share it to local officials and the community.
                  </p>
                </div>

                <div className="flex-shrink-0 pt-2 md:pt-0">
                  <Link href={`/projects/${project.reference}/ideation`} className="inline-block w-full md:w-auto">
                    <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2">
                      Submit Your Idea
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                </div>

              </div>
            </div>

            {ideas && ideas.length > 0 && (
              <div>
                <p className="text-base font-semibold text-gray-900 mb-4">
                  {ideaCount} Community {ideaCount === 1 ? 'Idea' : 'Ideas'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ideas.map((idea) => (
                    <Card
                      key={idea.id}
                      href={`/projects/${idea.project_reference}/ideas/${idea.id}`}
                      imageSrc={idea.generated_image}
                      imageAlt={idea.title}
                      leadingCaption="Anonymous User"
                      trailingCaption={getRelativeTime(idea.created_at, true)}
                      title={idea.title}
                      subtitle={idea.description}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </PageLayout>
  );
}
