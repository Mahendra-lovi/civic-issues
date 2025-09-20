// app/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '@/services/supabaseclient'; // ✅ import supabase client

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error.message);
        router.replace('/auth/signin');
        return;
      }

      if (data.session) {
        router.replace('/home'); // ✅ logged in
      } else {
        router.replace('/auth/signin'); // ❌ not logged in
      }
    };

    checkSession();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
