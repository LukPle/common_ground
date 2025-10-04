import { createClient as createBrowserClient } from './client';
import { Project } from '../../types/project';
import { NewIdea } from '../../types/idea';

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

export async function createIdea(newIdea: NewIdea): Promise<{ data: any; error: any }> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from('ideas')
    .insert(newIdea)
    .select()
    .single();

  if (error) {
    console.error('Error creating idea:', error.message);
  }
  
  return { data, error };
}
