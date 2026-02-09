'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface FullscreenImageProps {
  imageSrc: string;
  onClose: () => void;
}

export function FullscreenImage({ imageSrc, onClose }: FullscreenImageProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-6 top-4 md:top-4 md:right-8 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-50 transition-colors"
        aria-label="Close image view"
      >
        <X className="w-6 h-6" />
      </button>
      <div
        className="relative max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageSrc}
          alt="Fullscreen view"
          className="block max-w-[95vw] max-h-[75vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}
