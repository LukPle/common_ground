"use client";

import { Card } from '@/components/core/card';
import { getRelativeTime, handleShare } from '@/lib/utils';
import { Idea } from '@/types/idea';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { CardButton } from '../core/card_button';

interface IdeaCardProps {
    idea: Idea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
    return (
        <Card
            href={`/projects/${idea.project_reference}/ideas/${idea.id}`}
            imageSrc={idea.generated_image}
            imageAlt={idea.title}
            leadingCaption="Anonymous User"
            trailingCaption={getRelativeTime(idea.created_at, true)}
            title={idea.title}
            subtitle={idea.description}
            footerTrailing={
                <CardButton
                    leadingIcon={<Upload className="w-4 h-4" />}
                    onClick={async (e) => {
                        const result = await handleShare(
                            idea.title,
                            'Check out this idea on Common Ground',
                            `${window.location.origin}/projects/${idea.project_reference}/ideas/${idea.id}`,
                            e
                        );
                        if (result?.type === 'clipboard') toast.success('Link copied');
                    }}
                />
            }
        />
    );
}
