import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Lightbulb, Calendar } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link href={`/projects/${project.reference}`} className="block group">
      <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="relative h-48 overflow-hidden">
          <Image 
            src={project.image} 
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          <div className="absolute top-4 left-4">
            <span className="bg-black/30 backdrop-blur-lg text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
              {project.category}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {project.title}
          </h3>
        
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
            {project.short_description}
          </p>
          
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5" title="Ideas Submitted">
                <Lightbulb className="w-4 h-4" />
                <span>{project.idea_count}</span>
              </div>
              <div className="flex items-center gap-1.5" title="Submission Deadline">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(project.deadline).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
};
