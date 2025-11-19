import { Card, CardContent } from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/utils';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Idea } from '../types/idea';

interface IdeaCardProps {
  idea: Idea;
}

export const IdeaCard = ({ idea }: IdeaCardProps) => {
  const relativeTime = formatRelativeTime(idea.created_at);
  const fullDate = new Date(idea.created_at).toLocaleString();

  return (
    <Link
      href={`/projects/${idea.project_reference}/ideas/${idea.id}`}
      className="block group"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-border h-full flex flex-col">
        <div className="relative h-56 w-full overflow-hidden bg-muted">
          {idea.generated_image ? (
            <Image
              src={idea.generated_image}
              alt={idea.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No Image</span>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-3 text-sm text-muted-foreground">
            <span>@username</span>
            <span title={fullDate} className="cursor-help text-tertiary-foreground">{relativeTime}</span>
          </div>

          <h3 className="font-medium text-foreground text-base mb-2 line-clamp-1" title={idea.title}>
            {idea.title}
          </h3>

          {idea.description && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow" title={idea.description}>
              {idea.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 border border-border rounded-md px-2 py-1 text-muted-foreground hover:bg-muted/50 transition-colors">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex items-center gap-1.5 border border-border rounded-md px-2 py-1 text-muted-foreground hover:bg-muted/50 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">5</span>
              </div>
            </div>

            <div className="flex items-center border border-border rounded-md px-2 py-1 text-muted-foreground hover:bg-muted/50 transition-colors">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
