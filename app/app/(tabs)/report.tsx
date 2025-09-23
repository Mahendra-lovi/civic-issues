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

const FLASK_BASE = 'http://192.168.0.179:5001'

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
    if (submitting) return; // prevent double submit

    if (!image) {
      Alert.alert('Missing fields', 'Image is required.');
      return;
    }
    if (!description.trim() && !audioUri) {
      Alert.alert('Missing fields', 'Please provide either text or audio.');
      return;
    }

    // Normalize predicted/user category to allowed backend categories
    const normalizeCategory = (val: string) => {
      const v = (val || '').toLowerCase().replace(/[_-]+/g, ' ').trim();
      if (!v) return '';
      if (/(pothole|potholes)/.test(v)) return 'potholes';
      if (/(normal\s*road|road\s*normal)/.test(v)) return 'normal road';
      if (/(street\s*light\s*off)/.test(v)) return 'street light off';
      if (/(street\s*light\s*on)/.test(v)) return 'street light on';
      if (/(garbage|trash|litter)/.test(v)) return 'garbage';
      return '';
    };

    const finalCategory = normalizeCategory(category);
    if (!finalCategory) {
      Alert.alert('Missing fields', 'Please select a valid category.');
      return;
    }

    if (!location) {
      Alert.alert('Missing fields', 'Please fetch your location.');
      return;
    }

    try {
      setSubmitting(true);
      // upload to server
      const record = await uploadIssue({
        imageUri: image,
        audioUri: audioUri ?? undefined,
        text: description.trim(),
        category: finalCategory,
        location,
      });

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
    } catch (err: any) {
      console.log('Submit err', err);
      Alert.alert('Error', err.message || 'Could not submit issue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incident Report</Text>
        <Text style={styles.headerSubtitle}>Submit a detailed report for official review</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Image Evidence Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="camera-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Photographic Evidence</Text>
            <Text style={styles.requiredIndicator}>*</Text>
          </View>
          
          <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
            {image ? (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: image }} style={styles.uploadedImage} />
                <View style={styles.imageActions}>
                  <TouchableOpacity style={styles.changeImageButton}>
                    <Ionicons name="pencil" size={16} color="#666" />
                    <Text style={styles.changeImageText}>Change Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <View style={styles.uploadIconContainer}>
                  <Ionicons name="cloud-upload-outline" size={32} color="#6B7280" />
                </View>
                <Text style={styles.uploadText}>Upload Evidence Photo</Text>
                <Text style={styles.uploadSubtext}>Tap to capture or select from gallery</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* AI Analysis Result */}
          {predicting ? (
            <View style={styles.analysisContainer}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.analysisText}>Analyzing image content...</Text>
            </View>
          ) : category ? (
            <View style={styles.analysisResult}>
              <View style={styles.analysisHeader}>
                <Ionicons name="analytics-outline" size={16} color="#059669" />
                <Text style={styles.analysisLabel}>Automated Classification</Text>
              </View>
              <Text style={styles.categoryText}>
                Category: {category}
                {confidence != null && (
                  <Text style={styles.confidenceText}> (Confidence: {Math.round(confidence * 100)}%)</Text>
                )}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Incident Description</Text>
            <Text style={styles.requiredIndicator}>*</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Provide a detailed description of the incident, including time, circumstances, and any relevant details..."
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.audioSection}>
            <Text style={styles.audioLabel}>Voice Recording (Optional)</Text>
            <TouchableOpacity
              style={[styles.audioButton, recording && styles.audioButtonRecording]}
              onPress={recording ? stopRecording : startRecording}
            >
              <Ionicons
                name={recording ? "stop-circle" : "mic-outline"}
                size={18}
                color={recording ? "#DC2626" : "#374151"}
              />
              <Text style={[styles.audioButtonText, recording && styles.audioButtonTextRecording]}>
                {recording ? 'Stop Recording' : 'Add Voice Note'}
              </Text>
            </TouchableOpacity>

            {recording && (
              <View style={styles.recordingStatus}>
                <View style={styles.recordingIndicator} />
                <Text style={styles.recordingStatusText}>Recording in progress...</Text>
              </View>
            )}

            {audioUri && !recording && (
              <View style={styles.audioSuccess}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#059669" />
                <Text style={styles.audioSuccessText}>Voice recording attached</Text>
              </View>
            )}
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Incident Location</Text>
            <Text style={styles.requiredIndicator}>*</Text>
          </View>

          <TouchableOpacity 
            style={[styles.locationButton, location && styles.locationButtonActive]} 
            onPress={fetchLocation}
            disabled={loadingAddress}
          >
            {loadingAddress ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <Ionicons 
                name={location ? "location" : "location-outline"} 
                size={18} 
                color={location ? "#059669" : "#2563EB"} 
              />
            )}
            <Text style={[styles.locationButtonText, location && styles.locationButtonTextActive]}>
              {loadingAddress ? 'Retrieving location...' : location ? 'Location captured' : 'Capture current location'}
            </Text>
            {!loadingAddress && (
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            )}
          </TouchableOpacity>

          {location && (
            <View style={styles.locationDetails}>
              <View style={styles.locationCard}>
                <View style={styles.locationRow}>
                  <Text style={styles.locationLabel}>Address:</Text>
                  <Text style={styles.locationValue} numberOfLines={3}>
                    {location.address ?? 'Address not available'}
                  </Text>
                </View>
                <View style={styles.locationRow}>
                  <Text style={styles.locationLabel}>Coordinates:</Text>
                  <Text style={styles.coordinatesValue}>
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Submit Section */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <View style={styles.submitContent}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.submitText}>Processing Report...</Text>
              </View>
            ) : (
              <View style={styles.submitContent}>
                <Ionicons name="paper-plane-outline" size={18} color="#fff" />
                <Text style={styles.submitText}>Submit Official Report</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={styles.submitDisclaimer}>
            By submitting this report, you confirm that all information provided is accurate and complete.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
    lineHeight: 20,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  requiredIndicator: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '500',
  },
  imageUploadContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: 200,
  },
  imageActions: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  changeImageText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginLeft: 4,
  },
  imagePlaceholder: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  uploadIconContainer: {
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  analysisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  analysisText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
  },
  analysisResult: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  analysisLabel: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  confidenceText: {
    fontWeight: '400',
    color: '#6B7280',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  textInput: {
    padding: 16,
    minHeight: 120,
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
  },
  audioSection: {
    marginTop: 16,
  },
  audioLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  audioButtonRecording: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  audioButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  audioButtonTextRecording: {
    color: '#DC2626',
  },
  recordingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    marginRight: 8,
  },
  recordingStatusText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '500',
  },
  audioSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
  },
  audioSuccessText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#059669',
    fontWeight: '500',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  locationButtonActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
  },
  locationButtonText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  locationButtonTextActive: {
    color: '#059669',
  },
  locationDetails: {
    marginTop: 16,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationRow: {
    marginBottom: 12,
  },
  locationLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationValue: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  coordinatesValue: {
    fontSize: 14,
    color: '#111827',
    fontFamily: 'monospace',
  },
  submitSection: {
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitDisclaimer: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
});