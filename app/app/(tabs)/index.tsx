import { View, Text, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Civic Issues</Text>
      <View style={styles.buttons}>
        <Link href="/report" asChild>
          <Button title="Report an Issue" />
        </Link>
        <Link href="/past" asChild>
          <Button title="Past Reported Issues" />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  buttons: { gap: 15 }
});
