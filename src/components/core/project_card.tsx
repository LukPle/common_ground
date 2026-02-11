import { getRelativeTime } from '@/lib/utils';
import { Project } from '@/types/project';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link href={`/projects/${project.reference}`} className="block group">
      <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-none hover:shadow-sm transition-all duration-300 border border-gray-150">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute top-4 left-4 flex gap-1.5">
            <span className="bg-black/30 backdrop-blur-lg text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
              {getRelativeTime(project.deadline)} left
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-grow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">
              {project.category}
            </p>
            <p className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              {project.idea_count} {project.idea_count === 1 ? 'Idea' : 'Ideas'}
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {project.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
            {project.short_description}
          </p>

        </div>
      </div>
    </Link>
  );
};
