'use client';

import { Github, Info, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-background text-muted-foreground border-t border-border mt-20">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-6">
          <p className="text-center md:text-left">
            &copy; 2025 Common Ground. Collaborative Citizen Participation.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="flex items-center gap-2 hover:text-gray-900 transition-colors">
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>
            <Link href="/privacy" className="flex items-center gap-2 hover:text-gray-900 transition-colors">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy Policy</span>
            </Link>
            <a
              href="https://github.com/LukPle/common_ground"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Open Source</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
