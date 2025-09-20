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

export default function ReportedScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState<null | {
    latitude: number;
    longitude: number;
    address?: string;
  }>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
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
              setImage(result.assets[0].uri);
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
              setImage(result.assets[0].uri);
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
      const record = await uploadIssue({
        imageUri: image,
        audioUri: audioUri || undefined,
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

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={category}
            onValueChange={(v) => setCategory(v)}
            style={styles.picker}
          >
            <Picker.Item label="Select category" value="" />
            <Picker.Item label="Road Issue" value="road" />
            <Picker.Item label="Water Issue" value="water" />
            <Picker.Item label="Garbage" value="garbage" />
            <Picker.Item label="Electricity" value="electricity" />
            <Picker.Item label="Other" value="other" />
          </Picker>
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
          <Button title="Submit Report" onPress={handleSubmit} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
