function getRequired(key: string): string {
  const value = process.env[key];
  if (value == null || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return getRequired('NEXT_PUBLIC_SUPABASE_URL');
  },
  get supabaseAnonKey() {
    return getRequired('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  },
};

export function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('FATAL: GEMINI_API_KEY environment variable is not set.');
    throw new Error('Server is missing GEMINI_API_KEY configuration.');
  }
  return key;
}
