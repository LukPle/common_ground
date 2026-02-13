"use client";

import { Card } from '@/components/core/card';
import { getRelativeTime, handleShare } from '@/lib/utils';
import { Project } from '@/types/project';
import { Lightbulb, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CardButton } from '../core/card_button';

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const router = useRouter();

    return (
        <Card
            href={`/projects/${project.reference}`}
            imageSrc={project.image}
            imageAlt={project.title}
            badge={`${getRelativeTime(project.deadline)} left`}
            leadingCaption={project.category}
            title={project.title}
            subtitle={project.short_description}
            footerLeading={
                <CardButton
                    title={project.idea_count}
                    leadingIcon={<Lightbulb className="w-4 h-4" />}
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/projects/${project.reference}/#get-active`);
                    }}
                />
            }
            footerTrailing={
                <CardButton
                    leadingIcon={<Upload className="w-4 h-4" />}
                    onClick={async (e) => {
                        const result = await handleShare(
                            project.title,
                            `Check out this project on Common Ground`,
                            `${window.location.origin}/projects/${project.reference}`,
                            e
                        );
                        if (result?.type === 'clipboard') toast.success('Link copied');
                    }}
                />
            }
        />
    );
}
