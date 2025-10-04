import { Database } from './supabase';

export type Idea = Database['public']['Tables']['ideas']['Row'];

export type NewIdea = Database['public']['Tables']['ideas']['Insert'];
