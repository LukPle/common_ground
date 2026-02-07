import { Calendar, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Idea } from '../types/idea';

interface IdeaCardProps {
  idea: Idea;
}

export const IdeaCard = ({ idea }: IdeaCardProps) => {
  return (
    <Link
      href={`/projects/${idea.project_reference}/ideas/${idea.id}`}
      className="block group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow transition-all duration-300 border border-gray-100 group">
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

        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 truncate" title={idea.title}>
            {idea.title}
          </h3>
          {idea.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2" title={idea.description}>
              {idea.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500" title={`Submitted on ${new Date(idea.created_at).toLocaleString()}`}>
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(idea.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
};
