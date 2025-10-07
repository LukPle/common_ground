import React from 'react';
import { Compass, Sparkles, Send } from 'lucide-react';

export const HowTo = () => {
  return (
    <div className="bg-gray-50 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
        <div className="max-w-3xl mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Idea, Realized</h2>
          <p className="text-lg text-gray-600">
            Go from a simple idea to a tangible, shareable concept in three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="relative p-6 rounded-2xl overflow-hidden border border-gray-200/75 bg-white shadow-sm">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/70 to-white"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm border border-gray-100">
                  <Compass className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Discover a Project</h3>
              </div>
              <p className="text-gray-600">
                Browse active initiatives and choose one that sparks your interest.
              </p>
            </div>
          </div>

          <div className="relative p-6 rounded-2xl overflow-hidden border border-gray-200/75 bg-white shadow-sm">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100/70 to-white"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm border border-gray-100">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Craft Your Vision</h3>
              </div>
              <p className="text-gray-600">
                Describe your idea and let our AI generate a visual to bring it to life.
              </p>
            </div>
          </div>

          <div className="relative p-6 rounded-2xl overflow-hidden border border-gray-200/75 bg-white shadow-sm">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-100/70 to-white"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm border border-gray-100">
                  <Send className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Launch Your Idea</h3>
              </div>
              <p className="text-gray-600">
                Submit your concept to share it with the community and gather support.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
