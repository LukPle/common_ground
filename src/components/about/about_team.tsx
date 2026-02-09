import { Building2 } from 'lucide-react';
import Image from 'next/image';
import type { TeamMember } from '@/types/team_member';

interface AboutTeamProps {
  teamMembers: TeamMember[];
}

export function AboutTeam({ teamMembers }: AboutTeamProps) {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 mb-4">
            Meet the team behind Common Ground
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Professionals building modern tools and processes.{' '}
            <span className="text-gray-900 font-semibold">
              We turn civic engagement into action.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 overflow-hidden shadow border border-gray-100"
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <Image
                    src={`/${member.image}`}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="rounded-full object-cover shadow-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-md font-medium text-blue-600 mb-4">
                  {member.role}
                </p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center mb-4"
                  aria-label={`${member.name} on LinkedIn`}
                >
                  <Image
                    src="/images/linkedin.svg"
                    alt="LinkedIn"
                    width={20}
                    height={20}
                  />
                </a>
                <p className="text-md text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto text-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 border text-white">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md p-2">
              <img
                src="/images/common_ground_logo.svg"
                alt="Common Ground logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse">
                <span className="absolute inset-0 rounded-full bg-sky-300/40 blur-sm" />
              </span>
            </div>

            <Building2 className="h-12 w-12 text-white" />
          </div>

          <h3 className="text-lg text-white font-semibold mb-2">
            Ready to transform your city?
          </h3>
          <p className="text-blue-100">
            We are just a message away. Connect with any of us on LinkedIn to
            start the conversation.
          </p>
        </div>
      </div>
    </div>
  );
}
