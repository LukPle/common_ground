import React from 'react';
import { Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center py-6 space-y-4 sm:space-y-0">
          <p className="text-sm text-center sm:text-left text-gray-500 font-medium">
            &copy; 2025. Common Ground. Collaborative Citizen Participation.
          </p>
          
          <a
            href="https://github.com/LukPle/common_ground"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Open Source</span>
          </a>

        </div>
      </div>
    </footer>
  );
};
