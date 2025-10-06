import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '../../../../../components/header';
import { Footer } from '../../../../../components/footer';
import { fetchIdeaById, fetchAllProjectAndIdeaIds, fetchProjectById } from '../../../../../lib/supabase/queries.server';
import { ChevronRight, Calendar, User } from 'lucide-react';

export async function generateStaticParams() {
  const ids = await fetchAllProjectAndIdeaIds();
  return ids;
}

export default async function IdeaDetailPage({ params }: { params: { id: string; ideaId: string } }) {
  const ideaDataPromise = fetchIdeaById(Number(params.ideaId));
  const projectDataPromise = fetchProjectById(params.id);

  const [idea, project] = await Promise.all([ideaDataPromise, projectDataPromise]);

  if (!idea || !project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Projects
              </Link>
            </li>
            <li>
            <div className="flex items-center">
                <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <Link 
                  href={`/projects/${project.reference}`}
                  className="ml-2 hover:text-gray-900 transition-colors"
                >
                  {project.title}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span className="ml-2 font-medium text-gray-800 truncate" title="Ideation">
                  {idea.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          
          <div className="relative aspect-[16/10] w-full bg-gray-100">
            {idea.generated_image ? (
              <Image 
                src={idea.generated_image} 
                alt={idea.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No Image Available</div>
            )}
          </div>

          <div>
            <div className="p-8 sm:p-10 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        {idea.title}
                    </h1>
                    {idea.description && (
                        <p className="text-gray-600 leading-relaxed text-lg">
                        {idea.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 pt-6 border-t border-gray-100">
                    <Calendar className="w-4 h-4" />
                    <span>
                        Submitted on {new Date(idea.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </span>
                </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
