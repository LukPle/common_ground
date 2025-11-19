import { Database } from './supabase';

export type Project = Database['public']['Tables']['projects']['Row'] & {
  idea_count?: number;
  // Temporary fields for map debugging (until lat/lng are added to DB)
  latitude?: number;
  longitude?: number;
};
