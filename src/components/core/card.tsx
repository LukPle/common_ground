import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface CardProps {
    href: string;
    imageSrc?: string | null;
    imageAlt?: string;
    badge?: string;
    leadingCaption?: string;
    trailingCaption?: string;
    title?: string;
    subtitle?: string | null;
    children?: ReactNode;
}

export const Card = ({
    href,
    imageSrc,
    imageAlt = "Card image",
    badge,
    leadingCaption,
    trailingCaption,
    title,
    subtitle,
    children
}: CardProps) => {
    return (
        <Link href={href} className="block group h-full">
            <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-none hover:shadow-sm transition-all duration-300 border border-gray-150">

                {imageSrc && (
                    <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {badge && (
                            <div className="absolute top-4 left-4">

                                <span className="bg-black/30 backdrop-blur-lg text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                                    {badge}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col flex-grow p-6">
                    {(leadingCaption || trailingCaption) && (
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-400 truncate mr-2">
                                {leadingCaption}
                            </p>
                            {trailingCaption && (
                                <p className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full flex-shrink-0">
                                    {trailingCaption}
                                </p>
                            )}
                        </div>
                    )}

                    {title && (
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1" title={title}>
                            {title}
                        </h3>
                    )}

                    {subtitle && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                            {subtitle}
                        </p>
                    )}

                    {children}
                </div>
            </div>
        </Link>
    );
}
