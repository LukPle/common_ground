import { ReactNode } from 'react';

interface CardButtonProps {
    title?: string | number;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const CardButton = ({
    title,
    leadingIcon,
    trailingIcon,
    onClick,
}: CardButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center justify-center gap-1.5 p-2 
                border border-gray-100 rounded-lg 
                hover:bg-gray-50 transition-colors 
            `}
        >
            {leadingIcon && (
                <span className="flex-shrink-0 text-gray-600">
                    {leadingIcon}
                </span>
            )}

            {title !== undefined && (
                <span className="text-sm font-medium text-gray-600 px-0.5">
                    {title}
                </span>
            )}

            {trailingIcon && (
                <span className="flex-shrink-0 text-gray-600">
                    {trailingIcon}
                </span>
            )}
        </button>
    );
};
