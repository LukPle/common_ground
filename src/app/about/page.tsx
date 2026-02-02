import {
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  Lightbulb,
  XCircle
} from 'lucide-react';
import Image from 'next/image';
import { Footer } from '../../components/footer';
import { Header } from '../../components/header';
import { teamMembers } from '../../data/team_members';
import { fetchCompletedProjectsCount, fetchTotalIdeaCount } from '../../lib/supabase/queries.server';

const formatStatValue = (value: string) => {
  const match = value.match(/^([<>])(.+)$/);
  const gradientClass = "bg-gradient-to-b from-blue-600 via-blue-600 via-60% to-indigo-700 bg-clip-text text-transparent";

  if (match) {
    const [, symbol, number] = match;
    return (
      <span className={`flex items-center ${gradientClass}`}>
        <span className="text-sm font-bold mr-1">{symbol}</span>
        <span>{number}</span>
      </span>
    );
  }

  return <span className={gradientClass}>{value}</span>;
};

export default async function About() {
  const totalIdeasPromise = fetchTotalIdeaCount();
  const completedProjectsPromise = fetchCompletedProjectsCount();

  const [totalIdeas, completedProjects] = await Promise.all([
    totalIdeasPromise,
    completedProjectsPromise
  ]);

  const stats = [
    {
      percentage: "89%",
      description: "of citizens demand more say in infrastructure and urban planning projects",
      citation: "TNS Emnid on behalf of the Bertelsmann Foundation (2012)"
    },
    {
      percentage: "<3%",
      description: "of citizens participate in Germany's largest city-wide participation project",
      citation: "Press release of the \"Stuttgart Bürgerhaushalt\" project (2023)"
    },
    {
      percentage: "73%",
      description: "of urban project delays are due to a lack of societal and political acceptance",
      citation: "Study by the Harvard Kennedy School (2014)"
    },
    {
      percentage: "19%",
      description: "of participants in civic engagement do not hold a higher education degree",
      citation: "Goethe University Frankfurt am Main on behalf of Mehr Demokratie e.V. (2019)"
    }
  ];

  const problems = [
    {
      title: "Black Box",
      description: "Citizens submit ideas but never hear back. Lack of transparency leads to frustration."
    },
    {
      title: "Resource Drain",
      description: "Administrations drown in manual evaluation of unstructured emails and letters."
    },
    {
      title: "Guest Bubble",
      description: "Only the 'usual suspects' participate. Results are rarely representative."
    },
    {
      title: "Tool Jungle",
      description: "Isolated solutions and confusing apps cause citizens to drop out."
    }
  ];

  const solutions = [
    {
      title: "Transparent Loops",
      description: "Automated status updates and clear visualization of how input shapes the outcome."
    },
    {
      title: "AI-Assisted Workflows",
      description: "AI clusters similar ideas and summarizes feedback, saving hundreds of hours."
    },
    {
      title: "Intuitive by Design",
      description: "AI-powered tools that assists in ideation and explanation of proposals, paired with a modern interface."
    },
    {
      title: "Unified Platform",
      description: "One central hub for all projects. Single sign-on, maximum engagement."
    }
  ];

  const usps = [
    "Open Source",
    "Made in Germany"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 mb-4">
            Making change happen
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting citizens and cities to shape the neighbourhoods of tomorrow. <span className="text-gray-900 font-semibold">This is Common Ground.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-x-16 items-stretch">

          <div className="md:col-span-2 flex flex-col justify-center">
            <p className="text-md md:text-lg text-gray-600 mb-6 leading-relaxed">
              Our mission is to bridge the gap between citizens and local governments by <span className="text-gray-900 font-semibold">making civic participation transparent, accessible, and effective</span>. We believe local residents are a city’s best experts, yet their voices are often lost in bureaucracy while <span className="text-gray-900 font-semibold">cities miss valuable input from the public</span>.
            </p>
            <p className="text-md md:text-lg text-gray-600 leading-relaxed">
              Leveraging <span className="text-gray-900 font-semibold">AI-powered tools</span>, we <span className="text-gray-900 font-semibold">help citizens communicate their ideas clearly and visually</span>, and <span className="text-gray-900 font-semibold">provide cities with structured, intelligently processed feedback</span>. This is what real collaborative urban planning looks like.
            </p>
          </div>

          <div className="md:col-span-2 md:row-start-2 flex flex-wrap gap-4 pt-2">
            {usps.map((usp, index) => (
              <div key={index} className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                <Check className="w-4 h-4 text-blue-600 mr-2" strokeWidth={3} />
                <span className="text-sm font-semibold text-blue-600">{usp}</span>
              </div>
            ))}
          </div>

          <div className="md:col-span-1 md:col-start-3 md:row-start-1 h-full">
            <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex flex-1 items-center px-8 py-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-full flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-blue-600" strokeWidth={2} />
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

              <div className="h-px w-full bg-gray-100" />

              <div className="flex flex-1 items-center px-8 py-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-full flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-blue-600" strokeWidth={2} />
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

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 mb-4">
            Citizen participation needs a refresh
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            High motivation meets low impact. <span className="text-gray-900 font-semibold">The result is unresponsive and frustrated citizens.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between h-full"
            >
              <div>
                <div className="text-3xl font-semibold mb-3 w-fit">
                  {formatStatValue(stat.percentage)}
                </div>
                <p className="text-md md:text-lg text-gray-600 leading-snug">
                  {stat.description}
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-8 font-medium">
                {stat.citation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Solution Comparison Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 mb-4">
            Communities are ready to get involved
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Today’s tools hold them back with unnecessary barriers and poor usability. <span className="text-gray-900 font-semibold">Here's how we fix it.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Left: Competition */}
          <div className="bg-gray-100 rounded-3xl p-8 lg:p-10 border border-gray-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700">Other Platforms</h3>
            </div>

            <div className="space-y-8 ml-4 relative">
              {problems.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Common Ground */}
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
                    <Check className="w-5 h-5 text-blue-500" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 mb-4">
              Meet the team behind Common Ground
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Professionals building modern tools and processes. <span className="text-gray-900 font-semibold"> We turn civic engagement into action.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 overflow-hidden shadow border border-gray-100">
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
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-md font-medium text-blue-600 mb-4">{member.role}</p>
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
                  <p className="text-md text-gray-600 leading-relaxed">{member.description}</p>
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
              We are just a message away. Connect with any of us on LinkedIn to start the conversation.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
