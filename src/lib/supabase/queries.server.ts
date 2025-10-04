import { createClient as createServerClient } from './server';
import { Project } from '../../types/project';
import { unstable_noStore as noStore } from 'next/cache';
import { createServerClient as createClientForBuild } from '@supabase/ssr';

export async function fetchProjects(): Promise<Project[]> {
  noStore();
  const supabase = createServerClient();
  const { data: projects, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('Database Error:', error.message);
    return []; 
  }
  return projects;
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  noStore();
  const supabase = createServerClient();
  const { data: project, error } = await supabase.from('projects').select('*').eq('reference', id).single();

  if (error) {
    console.error('Database Error:', error.message);
    return null;
  }
  return project;
}

export async function fetchProjectIds(): Promise<{ reference: string }[]> {
  const supabase = createClientForBuild(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: {
        get() { return undefined; },
        set() { /* Do nothing */ },
        remove() { /* Do nothing */ },
      },
    }
  );

  const { data, error } = await supabase.from('projects').select('reference');
  if (error) {
    console.error('Database Error during build:', error.message);
    return [];
  }
  return data;
}
