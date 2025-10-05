import React from 'react';

export const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block">Shaping Cities on</span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-transparent bg-clip-text">
              Common Ground
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Bring your voice to the table. Share ideas, shape policies, and co-create the cities we need for tomorrow.
          </p>
        </div>
      </div>
    </div>
  );
};
