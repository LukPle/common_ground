'use client';

import React, { useState } from 'react';
import { IdeaCard } from './idea_card';
import { Idea } from '../types/idea';

const INITIAL_DISPLAY_COUNT = 6;
const IDEAS_TO_LOAD = 6;

export const IdeaList = ({ ideas, ideaCount }: { ideas: Idea[], ideaCount: number }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);

  const showMoreIdeas = () => {
    setVisibleCount(prevCount => prevCount + IDEAS_TO_LOAD);
  };

  const visibleIdeas = ideas.slice(0, visibleCount);

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Community Ideas ({ideaCount})</h3>
      
      {/* Grid of visible ideas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
      
      {/* "Show More" Button */}
      {visibleCount < ideas.length && (
        <div className="text-center mt-8">
          <button 
            onClick={showMoreIdeas}
            className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all shadow-sm border border-gray-200"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};
