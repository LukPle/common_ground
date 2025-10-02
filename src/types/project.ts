export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  participants: number;
  deadline: string;
  image: string;
  color: string;
  fullDescription?: string;
  objectives?: string[];
  location?: string;
}
