import { Database } from './supabase';

export type Project = Omit<Database['public']['Tables']['projects']['Row'], 'location'> & {
  idea_count: number;
  location_geojson: {
    type: string;
    coordinates: number[];
  } | null;
};
