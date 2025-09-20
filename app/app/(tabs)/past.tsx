// app/(tabs)/past.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView } from 'react-native';
import { supabase } from '@/services/supabaseclient';  
import useRealtimeMessages from '@/hooks/useRealtimeMessages';

export default function PastIssuesScreen() {
  const [userId, setUserId] = useState<string>('');

  // Fetch current user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
      if (error) console.log('Error fetching user:', error);
    };
    fetchUser();
  }, []);

  // Subscribe to realtime messages for this user
  const issues = useRealtimeMessages(userId);

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Pending':
        return { color: 'orange' };
      case 'In Progress':
        return { color: '#0A84FF' };
      case 'Resolved':
        return { color: 'green' };
      default:
        return { color: '#888' };
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* Top row: category and created date */}
      <View style={styles.rowTop}>
        <Text style={styles.category}>{item.category ?? 'Uncategorized'}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
      </View>

      {/* Status row */}
      <View style={styles.rowTop}>
        <Text style={styles.category}>Status:</Text>
        <Text style={[styles.status, getStatusColor(item.status)]}>
          {item.status ?? 'Pending'}
        </Text>
      </View>

      {/* Image */}
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.cardImage} />
      ) : (
        <View style={styles.noImage}>
          <Text style={{ color: '#888' }}>No image</Text>
        </View>
      )}

      {/* Text description */}
      {item.text && <Text style={styles.desc}>{item.text}</Text>}

      {/* Location info */}
      <View style={styles.locationBlock}>
        <Text style={styles.locationText}>
          📍 {item.address ?? (item.latitude && item.longitude ? `${item.latitude}, ${item.longitude}` : "No location")}
        </Text>
        {item.latitude != null && item.longitude != null && (
          <Text style={styles.coords}>
            Lat: {item.latitude.toFixed(6)}, Lng: {item.longitude.toFixed(6)}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={issues}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#666' }}>
            No reports yet
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  status: { fontWeight: '700', fontSize: 12 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  category: { fontWeight: '700' },
  date: { color: '#888', fontSize: 12 },
  cardImage: { width: '100%', height: 180, borderRadius: 8, marginBottom: 8 },
  noImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  desc: { fontSize: 14, marginBottom: 8 },
  locationBlock: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 8 },
  locationText: { fontSize: 13 },
  coords: { color: '#666', fontSize: 12, marginTop: 4 },
});
