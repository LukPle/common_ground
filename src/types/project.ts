export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  ideas: number;
  deadline: string;
  image: string;
  color: string;
  fullDescription?: string;
  limitations?: string[];
}
