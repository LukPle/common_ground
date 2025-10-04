import { createClient as createBrowserClient } from './client';
import { Project } from '../../types/project';

export async function fetchProjectByIdClient(id: string): Promise<Project | null> {
  const supabase = createBrowserClient();
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('reference', id)
    .single();

  if (error) {
    console.error('Client-side fetch error:', error.message);
    return null;
  }
  return project;
}
