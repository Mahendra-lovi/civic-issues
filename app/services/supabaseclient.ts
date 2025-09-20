// services/supabaseclient.ts

// Polyfill for React Native to support URL, URLSearchParams, etc.
import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project details
const SUPABASE_URL = 'https://ihktvvuthoadmjjvoknz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloa3R2dnV0aG9hZG1qanZva256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzQ1MjUsImV4cCI6MjA3MzYxMDUyNX0.-jt4vKKe4SffzNT2hYFr6ro2G5qFQQZrW7aeowjqx5A';

// Create a single Supabase client for use throughout your app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,      // Keep user logged in across app restarts
    detectSessionInUrl: false, // Not needed for React Native
  },
});
