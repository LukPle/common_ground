'use client';

import { useEffect, useRef, useState } from 'react';
import { Idea } from '../types/idea';
import { IdeaCard } from './idea_card';

const INITIAL_DISPLAY_COUNT = 6;
const IDEAS_TO_LOAD = 6;

export const IdeaList = ({ ideas, ideaCount }: { ideas: Idea[], ideaCount: number }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < ideas.length) {
          setVisibleCount(prevCount => Math.min(prevCount + IDEAS_TO_LOAD, ideas.length));
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [visibleCount, ideas.length]);

  const visibleIdeas = ideas.slice(0, visibleCount);

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Community Ideas ({ideaCount})</h3>

      {/* Grid of visible ideas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>

      {/* Lazy load trigger element */}
      {visibleCount < ideas.length && (
        <div
          ref={observerTarget}
          className="flex justify-center items-center py-8"
        >
          <div className="animate-pulse text-gray-500 text-sm">
            Loading more ideas...
          </div>
        </div>
      )}
    </div>
  );
};
