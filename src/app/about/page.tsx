import React from 'react';
import Image from 'next/image';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Users, Target, Lightbulb} from 'lucide-react';
import { teamMembers } from '../../data/team_members';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              About Common Ground
            </h1>
            <p className="text-xl text-gray-600">
              Building shared understanding and collaborative solutions for sustainable communities
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              We believe that the best communities are built when everyone comes together on common ground. 
              Our platform bridges diverse perspectives, creating shared understanding and collaborative solutions 
              for sustainable urban development.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Through visual collaboration, AI-enhanced design tools, and inclusive planning processes, we're 
              transforming how communities envision and create their shared future.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Inclusive Participation</h3>
                  <p className="text-sm text-gray-600">Ensuring every voice is heard and valued</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Transparent Process</h3>
                  <p className="text-sm text-gray-600">Clear, open decision-making workflows</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
              <div className="mb-6">
                <Lightbulb className="w-12 h-12 text-blue-200 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Making Change Happen</h3>
                <p className="text-blue-100">
                  From neighborhood improvements to city-wide initiatives, we provide the tools 
                  and platform for citizens to collaborate with local government effectively.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-blue-500">
                <div>
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-sm text-blue-200">Active Citizens</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-sm text-blue-200">Projects Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to empowering communities and fostering meaningful civic engagement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm font-medium text-blue-600 mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
