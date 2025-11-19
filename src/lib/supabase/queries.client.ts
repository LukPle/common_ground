import { NewIdea } from '../../types/idea';
import { Project } from '../../types/project';
import { createClient as createBrowserClient } from './client';

export async function fetchProjectsClient(): Promise<Project[]> {
  const supabase = createBrowserClient();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Client-side fetch error:', error.message);
    return [];
  }
  return projects || [];
}

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
