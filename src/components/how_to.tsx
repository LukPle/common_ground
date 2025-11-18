import { Compass, Send, Sparkles } from 'lucide-react';

export const HowTo = () => {
  return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">

          <div className="relative p-6 rounded-2xl overflow-hidden border border-white bg-white">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/70 to-white"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Compass className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">1. Discover a Project</h3>
              </div>
              <p className="text-black/60">
                Browse active initiatives and choose one that sparks your interest.
              </p>
            </div>
          </div>

          <div className="relative p-6 rounded-2xl overflow-hidden border border-white bg-white">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100/70 to-white"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">2. Craft Your Vision</h3>
              </div>
              <p className="text-black/60">
                Describe your idea and let our AI generate a visual to bring it to life.
              </p>
            </div>
          </div>

          <div className="relative p-6 rounded-2xl overflow-hidden border border-white bg-white">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-100/70 to-white"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Send className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">3. Launch Your Idea</h3>
              </div>
              <p className="text-black/60">
                Submit your concept to share it with the community and gather support.
              </p>
            </div>
          </div>

        </div>
  );
};
