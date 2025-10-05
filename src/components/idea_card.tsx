import React from 'react';
import Image from 'next/image';
import { Idea } from '../types/idea';
import { Calendar } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
}

export const IdeaCard = ({ idea }: IdeaCardProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
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
        
        <div className="flex items-center justify-start pt-3 border-t border-gray-100">
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
        </div>
      </div>
    </div>
  );
};
