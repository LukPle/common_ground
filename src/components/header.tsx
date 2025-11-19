import Image from 'next/image';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-3">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/images/common_ground_logo.svg"
              alt="Common Ground Logo"
              width={48}
              height={48}
              priority
            />
            <div>
              <h1 className="text-l font-semibold text-foreground">
                Common Ground
              </h1>
              <p className="text-xs text-muted-foreground">
                Collaborative Citizen Participation
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
