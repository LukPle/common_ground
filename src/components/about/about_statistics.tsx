import type { AboutStat } from '@/data/about';

interface AboutStatisticsProps {
  stats: AboutStat[];
}

const gradientClass =
  'bg-gradient-to-b from-blue-600 via-blue-600 via-60% to-indigo-700 bg-clip-text text-transparent';

interface StatValueProps {
  value: string;
}

export function StatValue({ value }: StatValueProps) {
  const match = value.match(/^([<>])(.+)$/);

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
}

export function AboutStatistics({ stats }: AboutStatisticsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 mb-4">
          Citizen participation needs a refresh
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          High motivation meets low impact.{' '}
          <span className="text-gray-900 font-semibold">
            The result is unresponsive and frustrated citizens.
          </span>
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
                <StatValue value={stat.percentage} />
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
  );
}
