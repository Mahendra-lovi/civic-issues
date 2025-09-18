// app/(tabs)/past.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView } from 'react-native';
import { getIssues } from '../../services/issues';
import { useIsFocused } from '@react-navigation/native';

export default function PastIssuesScreen() {
  const [issues, setIssues] = useState<any[]>([]);
  const focused = useIsFocused();

  useEffect(() => {
    // refresh every time screen is focused
    setIssues(getIssues());
  }, [focused]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        <Text style={styles.category}>{item.category ?? 'Uncategorized'}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>

      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      ) : (
        <View style={styles.noImage}><Text style={{ color: '#888' }}>No image</Text></View>
      )}

      <Text style={styles.desc}>{item.description}</Text>

      {item.location && (
        <View style={styles.locationBlock}>
          <Text style={styles.locationText}>📍 {item.location.address ?? `${item.location.latitude}, ${item.location.longitude}`}</Text>
          <Text style={styles.coords}>Lat: {item.location.latitude.toFixed(6)}, Lng: {item.location.longitude.toFixed(6)}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={issues}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 30, color: '#666' }}>No reports yet</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
