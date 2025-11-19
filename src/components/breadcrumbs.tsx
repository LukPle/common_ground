'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

type BreadcrumbItemType = {
  label: string;
  href?: string;
};

interface BreadcrumbsProps {
  items: BreadcrumbItemType[];
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
    <div className="sticky top-[73px] z-40 bg-background border-b border-border">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">

        {/* Left Scroll */}
        <div
          className={`absolute top-0 left-2 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none transition-opacity duration-300 z-10
            ${showLeftFade ? 'opacity-100' : 'opacity-0'}`} />

        <div className="flex items-center overflow-hidden">
          <Breadcrumb>
            <BreadcrumbList
              ref={scrollContainerRef}
              className="flex-nowrap overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1 sm:pb-0"
            >
              {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                  <React.Fragment key={index}>
                    {index > 0 && <BreadcrumbSeparator className="flex-shrink-0" />}
                    <BreadcrumbItem className="flex-shrink-0">
                      {isLast ? (
                        <BreadcrumbPage className="truncate max-w-[200px] sm:max-w-none" title={item.label}>
                          {item.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={item.href || '#'} className="flex-shrink-0">
                            {item.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right Scroll */}
        <div
          className={`absolute top-0 right-4 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none transition-opacity duration-300 z-10
            ${showRightFade ? 'opacity-100' : 'opacity-0'}`} />

      </div>
    </div>
  );
};
