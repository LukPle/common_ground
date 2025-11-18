'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const scrollContainerRef = useRef<HTMLOListElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    const element = scrollContainerRef.current;

    const checkFades = () => {
      if (!element) return;

      const { scrollLeft, scrollWidth, clientWidth } = element;

      setShowLeftFade(scrollLeft > 0);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth);
    };

    checkFades();
    window.addEventListener('resize', checkFades);

    element?.addEventListener('scroll', checkFades);

    return () => {
      window.removeEventListener('resize', checkFades);
      element?.removeEventListener('scroll', checkFades);
    };
  }, [items]);

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">

        {/* Left Scroll */}
        <div
          className={`absolute top-0 left-2 bottom-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none transition-opacity duration-300
            ${showLeftFade ? 'opacity-100' : 'opacity-0'}`} />

        <div className="flex items-center overflow-hidden pt-1">
          <ol
            ref={scrollContainerRef}
            className="flex items-center space-x-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap pb-2
              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <li key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400" />}

                  {isLast ? (
                    <span className={`ml-2 font-medium text-gray-800 truncate`} title={item.label}>
                      {item.label}
                    </span>
                  ) : (
                    <Link href={item.href || '#'} className="ml-2 hover:text-gray-900 transition-colors flex-shrink-0">
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}

          </ol>
        </div>

        {/* Right Scroll */}
        <div
          className={`absolute top-0 right-4 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none transition-opacity duration-300
            ${showRightFade ? 'opacity-100' : 'opacity-0'}`} />

      </nav>
    </div>
  );
};
