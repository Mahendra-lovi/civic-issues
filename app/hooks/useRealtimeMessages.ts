import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseclient';

export default function useRealtimeMessages(userId: string) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    // --- Fetch initial messages ---
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && isMounted) setMessages(data);
    };
    fetchMessages();

    // --- Realtime subscription (v2 syntax) ---
    const channel = supabase
      .channel(`public:messages:user_id=eq.${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `user_id=eq.${userId}` },
        (payload) => {
          setMessages((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages', filter: `user_id=eq.${userId}` },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
          );
        }
      )
      .subscribe();

    // --- Cleanup ---
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return messages;
}
