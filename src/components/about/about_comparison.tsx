import { Check, CheckCircle2, XCircle } from 'lucide-react';
import type { AboutProblemOrSolution } from '@/data/about';

interface AboutComparisonProps {
  problems: AboutProblemOrSolution[];
  solutions: AboutProblemOrSolution[];
}

export function AboutComparison({ problems, solutions }: AboutComparisonProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 mb-4">
          Communities are ready to get involved
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Today's tools hold them back with unnecessary barriers and poor
          usability.{' '}
          <span className="text-gray-900 font-semibold">
            Here's how we fix it.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-gray-100 rounded-3xl p-8 lg:p-10 border border-gray-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700">
              Other Platforms
            </h3>
          </div>

          <div className="space-y-8 ml-4 relative">
            {problems.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 lg:p-10 border-2 border-blue-200 shadow-[0_0_30px_rgba(219,234,254,0.7)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-blue-50 rounded-tr-full -ml-8 -mb-8 opacity-50 pointer-events-none" />

          <div className="flex items-center gap-4 mb-8 relative">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-blue-600">Common Ground</h3>
          </div>

          <div className="space-y-8 ml-2 relative">
            {solutions.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <Check
                    className="w-5 h-5 text-blue-500"
                    strokeWidth={3}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
