import React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CitizenVoice</h1>
              <p className="text-xs text-gray-500">Participation Platform</p>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-sm font-medium text-blue-600">
              Projects
            </Link>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
