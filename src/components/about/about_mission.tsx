import { aboutUsps } from '@/data/about';
import { BarChart3, Check, Lightbulb } from 'lucide-react';

interface AboutMissionProps {
  totalIdeas: number;
  completedProjects: number;
}

export function AboutMission({
  totalIdeas,
  completedProjects,
}: AboutMissionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 mb-4">
          Making change happen
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Connecting citizens and cities to shape the neighbourhoods of
          tomorrow.{' '}
          <span className="text-gray-900 font-semibold">
            This is Common Ground.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-x-16 items-stretch">
        <div className="md:col-span-2 flex flex-col justify-center">
          <p className="text-md md:text-lg text-gray-600 mb-6 leading-relaxed">
            Our mission is to bridge the gap between citizens and local
            governments by{' '}
            <span className="text-gray-900 font-semibold">
              making civic participation transparent, accessible, and
              effective
            </span>
            . We believe local residents are a city's best experts, yet their
            voices are often lost in bureaucracy while{' '}
            <span className="text-gray-900 font-semibold">
              cities miss valuable input from the public
            </span>
            .
          </p>
          <p className="text-md md:text-lg text-gray-600 leading-relaxed">
            Leveraging{' '}
            <span className="text-gray-900 font-semibold">AI-powered tools</span>
            , we{' '}
            <span className="text-gray-900 font-semibold">
              help citizens communicate their ideas clearly and visually
            </span>
            , and{' '}
            <span className="text-gray-900 font-semibold">
              provide cities with structured, intelligently processed feedback
            </span>
            . This is what real collaborative urban planning looks like.
          </p>
        </div>

        <div className="md:col-span-2 md:row-start-2 flex flex-wrap gap-4 pt-2">
          {aboutUsps.map((usp, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100"
            >
              <Check className="w-4 h-4 text-blue-600 mr-2" strokeWidth={3} />
              <span className="text-sm font-semibold text-blue-600">{usp}</span>
            </div>
          ))}
        </div>

        <div className="md:col-span-1 md:col-start-3 md:row-start-1 h-full">
          <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-150 overflow-hidden">
            <div className="flex flex-1 items-center px-8 py-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-full flex-shrink-0">
                  <Lightbulb
                    className="w-6 h-6 text-blue-600"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight leading-none">
                    {totalIdeas}
                  </div>
                  <div className="text-sm text-gray-600 tracking-wider">
                    Ideas Submitted
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px mx-8 bg-gray-100" />

            <div className="flex flex-1 items-center px-8 py-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-full flex-shrink-0">
                  <BarChart3
                    className="w-6 h-6 text-blue-600"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <div className="text-2xl md:text-2xl font-semibold text-gray-900 tracking-tight leading-none">
                    {completedProjects}
                  </div>
                  <div className="text-sm text-gray-600 tracking-wider">
                    Projects Completed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
