import { createClient as createServerClient } from './server';
import { Project } from '../../types/project';
import { Idea } from '../../types/idea';
import { unstable_noStore as noStore } from 'next/cache';
import { createServerClient as createClientForBuild } from '@supabase/ssr';

export async function fetchProjects(): Promise<Project[]> {
  noStore();
  const supabase = createServerClient();
  const { data: projects, error } = await supabase.rpc('get_projects_with_idea_counts');

  if (error) {
    console.error('Database Error:', error.message);
    return []; 
  }
  return projects || [];
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

export async function fetchCompletedProjectsCount(): Promise<number> {
  noStore();
  const supabase = createServerClient();
  
  const now = new Date().toISOString();
  
  const { count, error } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .lt('deadline', now);

  if (error) {
    console.error('Database Error fetching completed projects count:', error.message);
    return 0;
  }

  return count || 0;
}

export async function fetchIdeaCountForProject(projectReference: string): Promise<number> {
  noStore();
  const supabase = createServerClient();
  
  const { count, error } = await supabase
    .from('ideas')
    .select('*', { count: 'exact', head: true })
    .eq('project_reference', projectReference);

  if (error) {
    console.error('Database Error fetching idea count:', error.message);
    return 0;
  }

  return count || 0;
}

export async function fetchIdeasForProject(projectReference: string): Promise<Idea[]> {
  noStore();
  const supabase = createServerClient();
  const { data: ideas, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('project_reference', projectReference)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Database Error fetching ideas:', error.message);
    return [];
  }
  return ideas;
}

export async function fetchIdeaById(id: number): Promise<Idea | null> {
  noStore();
  const supabase = createServerClient();
  const { data: idea, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Database Error fetching idea with id ${id}:`, error.message);
    return null;
  }
  return idea;
}

export async function fetchAllProjectAndIdeaIds(): Promise<{ id: string; ideaId: string }[]> {
  const supabase = createClientForBuild(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get() { return undefined; }, set() {}, remove() {} } }
  );

  const { data, error } = await supabase
    .from('ideas')
    .select('id, project_reference');

  if (error) {
    console.error('Database Error during build (fetchAllProjectAndIdeaIds):', error.message);
    return [];
  }
  
  return data.map(item => ({
    id: item.project_reference,
    ideaId: String(item.id),
  }));
}

export async function fetchTotalIdeaCount(): Promise<number> {
  noStore();
  const supabase = createServerClient();
  
  const { count, error } = await supabase
    .from('ideas')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Database Error fetching total idea count:', error.message);
    return 0;
  }

  return count || 0;
}
