import React from 'react';

export const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Building Communities on Common Ground
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Unite around shared vision. Collaborate on sustainable urban projects and help design the future we all want to live in.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Explore Projects
            </button>
            <button className="bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all border border-gray-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
