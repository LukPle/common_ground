'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-white/80 sticky top-0 z-40 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <Image
                src="/images/common_ground_logo.svg"
                alt="Common Ground Logo"
                width={56}
                height={56}
                priority
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Common Ground</h1>
                <p className="text-xs text-gray-500">Collaborative Citizen Participation</p>
              </div>
            </Link>

            {/* Desktop Navigation - Visible on SM and up */}
            <nav className="hidden sm:flex sm:space-x-4 gap-4">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Projects
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/about'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                About
              </Link>
            </nav>

            {/* Burger Icon - Hidden on SM and up */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Only active below SM */}
      <div
        className={`fixed inset-0 z-50 bg-white transition-opacity duration-300 ease-in-out sm:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-5 right-6 p-2 text-gray-600 hover:text-gray-900"
          aria-label="Close menu"
        >
          <X size={28} />
        </button>
        <nav className="flex flex-col items-center justify-center h-full space-y-10">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className={`text-3xl font-bold transition-colors ${
              pathname === '/' ? 'text-blue-600' : 'text-gray-800 hover:text-blue-600'
            }`}
          >
            Projects
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className={`text-3xl font-bold transition-colors ${
              pathname === '/about' ? 'text-blue-600' : 'text-gray-800 hover:text-blue-600'
            }`}
          >
            About
          </Link>
        </nav>
      </div>
    </>
  );
};
