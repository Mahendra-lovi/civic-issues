// app/(tabs)/report.tsx
import React, { useState } from 'react';
import { Audio } from 'expo-av';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Button,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
// import { addIssue } from '../../services/issues';
import { useRouter } from 'expo-router';
// import { Issue, addIssue } from '../../services/issues';
import { uploadIssue } from '../../services/api';

const FLASK_BASE = 'http://192.168.0.197:5001'

export default function ReportedScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState<null | {
    latitude: number;
    longitude: number;
    address?: string;
  }>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const router = useRouter();

  // pick image from library
  const pickImage = async () => {
  Alert.alert(
    "Select Image",
    "Choose the image source",
    [
      {
        text: "Camera",
        onPress: async () => {
          try {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.7,
            });
            if (!result.canceled) {
              const uri = result.assets[0].uri;
                setImage(uri);
                await classifyWithBackend(uri);
            }
          } catch (err) {
            console.log("Camera err", err);
            Alert.alert("Error", "Could not open camera");
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          try {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.7,
            });
            if (!result.canceled) {
              const uri = result.assets[0].uri;
                setImage(uri);
                await classifyWithBackend(uri);
            }
          } catch (err) {
            console.log("Gallery err", err);
            Alert.alert("Error", "Could not open gallery");
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ],
    { cancelable: true }
  );
};


  const classifyWithBackend = async (imageUri: string) => {
    try {
      setPredicting(true);
      // Build FormData with "file" to match Flask's request.files["file"] [web:11]
      const filename = imageUri.split('/').pop() || 'image.jpg';
      // Heuristic mime type; ImagePicker returns jpeg/png most often [web:28]
      const ext = filename.split('.').pop()?.toLowerCase();
      const mime =
        ext === 'png' ? 'image/png' :
        ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
        'image/jpeg';

      const form = new FormData();
      form.append('file', {
        // On Expo, just pass the local file URI, name, and type for multipart [web:28]
        uri: imageUri,
        name: filename,
        type: mime,
      } as any);

      // Do NOT set Content-Type manually; let fetch set boundary for FormData [web:28]
      const res = await fetch(`${FLASK_BASE}/predict`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: form,
      });
const contentType = res.headers.get('content-type') || '';
      const raw = await res.clone().text();
      if (!contentType.includes('application/json')) {
        console.log('Predict non-JSON response:', raw);
        throw new Error(`Expected JSON but got ${contentType} (status ${res.status})`);
      }
      if (!res.ok) {
        throw new Error(`Predict HTTP ${res.status}: ${raw}`);
      }

      const json = await res.json();
      setCategory(json.predicted_class || '');
      setConfidence(typeof json.confidence === 'number' ? json.confidence : null);
    } catch (e: any) {
      console.log('predict error', e);
      Alert.alert('Classification failed', e?.message ?? 'Could not classify image');
      setCategory('');
      setConfidence(null);
    } finally {
      setPredicting(false);
    }
  };



  // get location + human readable address (reverse geocode)
  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required.');
        return;
      }

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = pos.coords;

      setLoadingAddress(true);
      const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
      const first = reverse[0] ?? {};
      const addrParts = [
        first.name,
        first.street,
        first.city,
        first.region,
        first.postalCode,
        first.country,
      ].filter(Boolean);
      const address = addrParts.join(', ');

      setLocation({ latitude, longitude, address });
      setLoadingAddress(false);
    } catch (err) {
      console.log('fetchLocation err', err);
      setLoadingAddress(false);
      Alert.alert('Error', 'Could not get location');
    }
  };


  // start recording
const startRecording = async () => {
  try {
    console.log('Requesting permissions..');
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    console.log('Starting recording..');
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
  } catch (err) {
    console.error('Failed to start recording', err);
  }
};

// stop recording
const stopRecording = async () => {
  console.log('Stopping recording..');
  if (!recording) return;

  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  setAudioUri(uri);
  setRecording(null);
  console.log('Recording stored at', uri);
};



  const handleSubmit = async () => {
    if (!image) {
        if (submitting) return; // prevent double submit
  Alert.alert('Missing fields', 'Image is required.');
  return;
}
if (!description.trim() && !audioUri) {
  Alert.alert('Missing fields', 'Please provide either text or audio.');
  return;
}
if (!category) {
  Alert.alert('Missing fields', 'Please select a category.');
  return;
}
if (!location) {
  Alert.alert('Missing fields', 'Please fetch your location.');
  return;
}


    try {
      // upload to server
      const record = await uploadIssue({
        imageUri: image,
        audioUri: audioUri ?? undefined,
        text: description.trim(),
        category,
        location,
      });

    // addIssue(newIssue);
    Alert.alert('Success', 'Issue submitted');

    // Clear inputs (or navigate to Past)
    setImage(null);
    setDescription('');
    setCategory('');
    setLocation(null);
    setAudioUri(null);
    setConfidence(null);
    // go to Past screen
    router.push('/past');
  }catch (err: any) {
    console.log('Submit err', err);
    Alert.alert('Error', err.message || 'Could not submit issue');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.placeholderText}>📷 Tap to select image</Text>
          )}
        </TouchableOpacity>
          {predicting ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <ActivityIndicator size="small" />
            <Text style={{ marginLeft: 8 }}>Classifying image...</Text>
          </View>
        ) : category ? (
          <View style={{ marginBottom: 8 }}>
            <Text>Detected category: {category}{confidence != null ? ` (${Math.round(confidence * 100)}%)` : ''}</Text>
          </View>
        ) : null}
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TouchableOpacity
  style={styles.iconBtn}
  onPress={recording ? stopRecording : startRecording}
>
  <Ionicons
    name={recording ? "close-circle-outline" : "mic-outline"}
    size={26}
    color={recording ? "red" : "#333"}
  />
</TouchableOpacity>
</View>

        <TouchableOpacity style={styles.locationBtn} onPress={fetchLocation}>
          <Ionicons name="location-outline" size={20} color="white" />
          <Text style={styles.locationText}>{loadingAddress ? 'Fetching...' : 'Get Location'}</Text>
        </TouchableOpacity>

        {location && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationLine}>📍 {location.address ?? `${location.latitude}, ${location.longitude}`}</Text>
            <Text style={styles.locationLine}>Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}</Text>
          </View>
        )}
<View style={styles.submitWrap}>
  <TouchableOpacity
    style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
    onPress={handleSubmit}
    disabled={submitting}
  >
    {submitting ? (
      <Text style={styles.submitText}>Submitting...</Text>
    ) : (
      <Text style={styles.submitText}>Submit Report</Text>
    )}
  </TouchableOpacity>
</View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  submitBtn: {
  backgroundColor: '#0A84FF',
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
},
submitBtnDisabled: {
  backgroundColor: '#999',
},
submitText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},

  container: { padding: 16, alignItems: 'center' },
  card: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  imageBox: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: { width: '100%', height: '100%' },
  placeholderText: { color: '#888' },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  input: { flex: 1, minHeight: 40, borderBottomWidth: 1, borderColor: '#eee', padding: 8, fontSize: 15 },
  iconBtn: { paddingLeft: 10, justifyContent: 'center' },
  label: { fontWeight: '600', marginBottom: 6 },
  pickerWrap: { borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', marginBottom: 12 },
  picker: { height: 44, width: '100%' },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A84FF',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  locationText: { color: 'white', marginLeft: 8 },
  locationInfo: { marginTop: 8 },
  locationLine: { fontSize: 13, color: '#333' },
  submitWrap: { marginTop: 12 },
});
