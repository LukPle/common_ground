import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, ChevronRight, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link href={`/projects/${project.reference}`} className="block group">
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 border-border hover:shadow-md">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-black/30 backdrop-blur-lg text-white border-white/30 hover:bg-black/40">
              {project.category}
            </Badge>
          </div>
        </div>

        <CardContent>
          <h3 className="font-medium text-foreground mb-2">
            {project.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-0 line-clamp-2">
            {project.short_description}
          </p>
        </CardContent>

        <CardFooter className="justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" title="Ideas Submitted">
              <Lightbulb className="w-4 h-4" />
              <span>{project.idea_count}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Submission Deadline">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(project.deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all" />
        </CardFooter>
      </Card>
    </Link>
  );
};
