// services/supabaseclient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ihktvvuthoadmjjvoknz.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloa3R2dnV0aG9hZG1qanZva256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzQ1MjUsImV4cCI6MjA3MzYxMDUyNX0.-jt4vKKe4SffzNT2hYFr6ro2G5qFQQZrW7aeowjqx5A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // ✅ needed for web OAuth
  },
});
