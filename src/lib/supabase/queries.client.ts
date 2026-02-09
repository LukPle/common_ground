import type { Idea, NewIdea } from '@/types/idea';
import type { Project } from '@/types/project';
import type { PostgrestError } from '@supabase/supabase-js';
import { createClient as createBrowserClient } from './client';

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

export async function createIdea(newIdea: NewIdea): Promise<{ data: Idea | null; error: PostgrestError | null }> {
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
