import { getRelativeTime } from '@/lib/utils';
import { Idea } from '@/types/idea';
import Image from 'next/image';
import Link from 'next/link';

interface IdeaCardProps {
  idea: Idea;
}

export const IdeaCard = ({ idea }: IdeaCardProps) => {
  return (
    <Link
      href={`/projects/${idea.project_reference}/ideas/${idea.id}`}
      className="block group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-none hover:shadow-sm transition-all duration-300 border border-gray-150 group">
        <div className="relative h-48 overflow-hidden">
          {idea.generated_image ? (
            <Image
              src={idea.generated_image}
              alt={idea.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">
              Anonymous User
            </p>
            <p className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              {getRelativeTime(idea.created_at, true)}
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={idea.title}>
            {idea.title}
          </h3>
          {idea.description && (
            <p className="text-gray-600 text-sm line-clamp-2" title={idea.description}>
              {idea.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
