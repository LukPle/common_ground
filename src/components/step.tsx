'use client';

import React from 'react';
import { Check } from 'lucide-react';

export const Step = ({ number, title, isComplete, isActive, children }: {
  number: number;
  title: string;
  isLastStep: boolean;
  isComplete: boolean;
  isActive: boolean;
  children: React.ReactNode;
}) => {
  const isInactive = !isActive && !isComplete;

  return (
    <div className={`transition-opacity duration-300 ${isInactive ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`
            w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white 
            transition-all duration-300 flex-shrink-0
            ${isComplete
            ? 'bg-emerald-500 shadow-[0_0_0_4px_theme("colors.emerald.100")]'
            : isActive
              ? 'bg-blue-600 shadow-[0_0_0_4px_theme("colors.blue.100")]'
              : 'bg-gray-300'
          }`}
        >
          {isComplete ? <Check className="w-6 h-6" /> : number}
        </div>
        <h2 className={`text-xl font-semibold ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>
          {title}
        </h2>
      </div>

      {isActive && (
        <div className="mt-6">
          {children}
        </div>
      )}

      <div className="py-8">
        <hr className="border-gray-200" />
      </div>
    </div>
  );
};
