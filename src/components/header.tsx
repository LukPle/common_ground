import Image from 'next/image';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/images/common_ground_logo.svg"
              alt="Common Ground Logo"
              width={48}
              height={48}
              priority
            />
            <div>
              <h1 className="text-l font-semibold text-gray-900">
                Common Ground
              </h1>
              <p className="text-xs text-gray-500">
                Collaborative Citizen Participation
              </p>
            </div>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              href="/map"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Map
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
