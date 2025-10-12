'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index}>
                <div className="flex items-center">
                  {index > 0 && <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400" />}
                  
                  {isLast ? (
                    <span className={`ml-2 font-medium text-gray-800 truncate`} title={item.label}>
                      {item.label}
                    </span>
                  ) : (
                    <Link href={item.href || '#'} className="ml-2 hover:text-gray-900 transition-colors">
                      {item.label}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};
