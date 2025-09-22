// services/supabaseclient.ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ihktvvuthoadmjjvoknz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloa3R2dnV0aG9hZG1qanZva256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzQ1MjUsImV4cCI6MjA3MzYxMDUyNX0.-jt4vKKe4SffzNT2hYFr6ro2G5qFQQZrW7aeowjqx5A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,     // 👈 important for React Native
    autoRefreshToken: true,    // refresh token in background
    persistSession: true,      // keep session
    detectSessionInUrl: false, // no need for RN
  },
});
