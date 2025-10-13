import React, { useState, useEffect } from 'react';
import { LimitationCheck } from '../types/limitation_check';
import { CircleCheck, XCircle, CircleQuestionMark, ChevronDown } from 'lucide-react';

export const LimitationCheckCard = ({ result }: { result: LimitationCheck }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getStatusInfo = (status: LimitationCheck['status']) => {
        switch (status) {
            case 'Check': return { icon: <CircleCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />, backgroundColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800' };
            case 'Depending': return { icon: <CircleQuestionMark className="w-5 h-5 text-amber-600 flex-shrink-0" />, backgroundColor: 'bg-amber-50', borderColor: 'border-amber-200', textColor: 'text-amber-800' };
            case 'Violation': return { icon: <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />, backgroundColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-800' };
        }
    };

    const { icon, backgroundColor, borderColor, textColor } = getStatusInfo(result.status);

    return (
        <div className={`rounded-lg border overflow-hidden transition-all duration-300 ${backgroundColor} ${borderColor}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-start justify-between gap-3 text-left"
            >
                <div className="flex items-start gap-3">
                    {icon}
                    <p className={`text-sm ${textColor}`}>{result.limitation}</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
                <div className="px-4 pb-4">
                    <div className={`border-t ${borderColor} pt-3 text-sm text-gray-700`}>
                        {result.reasoning}
                    </div>
                </div>
            </div>
        </div>
    );
};
