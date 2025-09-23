// app/(tabs)/profile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/services/supabaseclient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const router = useRouter();

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();

        if (userErr || !user) {
          Alert.alert("Error", "You must be logged in");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.log("No profile row yet, creating new placeholder...");
          setProfile({
            id: user.id,
            email: user.email,
            full_name: "",
            phone: "",
            address: "",
            bio: "",
          });
        } else {
          setProfile(data);
          setAvatar(data.avatar_url);
        }
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Pick avatar
  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  // Save profile
  const saveProfile = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        Alert.alert("Error", "You must be logged in to update profile");
        setLoading(false);
        return;
      }

      let avatarUrl = profile?.avatar_url;

      if (avatar && avatar.startsWith("file://")) {
        const response = await fetch(avatar);
        const arrayBuffer = await response.arrayBuffer();
        const filePath = `avatars/${user.id}-${Date.now()}.jpg`;

        const { error: uploadErr } = await supabase.storage
          .from("avatars")
          .upload(filePath, new Uint8Array(arrayBuffer), {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = publicUrlData.publicUrl;
      }

      const updates = {
        id: user.id,
        full_name: profile?.full_name || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
        bio: profile?.bio || "",
        email: user.email,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;

      Alert.alert("Success", "Profile updated successfully!");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign out handler
  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              Alert.alert("Error", error.message);
            } else {
              router.replace("/auth/signin");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSpinner}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ff4757" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickAvatar}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#a4b0be" />
              </View>
            )}
            <View style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#a4b0be" style={styles.inputIcon} />
              <TextInput 
                style={[styles.input, styles.disabledInput]} 
                value={profile?.email}
                editable={false}
                placeholder="email@example.com"
                placeholderTextColor="#a4b0be"
              />
            </View>
          </View>

          {/* Full Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#a4b0be" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={profile?.full_name}
                onChangeText={(t) => setProfile({ ...profile, full_name: t })}
                placeholder="Enter your full name"
                placeholderTextColor="#a4b0be"
              />
            </View>
          </View>

          {/* Phone Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#a4b0be" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={profile?.phone}
                onChangeText={(t) => setProfile({ ...profile, phone: t })}
                keyboardType="phone-pad"
                placeholder="Enter your phone number"
                placeholderTextColor="#a4b0be"
              />
            </View>
          </View>

          {/* Address Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#a4b0be" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={profile?.address}
                onChangeText={(t) => setProfile({ ...profile, address: t })}
                placeholder="Enter your address"
                placeholderTextColor="#a4b0be"
              />
            </View>
          </View>

          {/* Bio Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons name="document-text-outline" size={20} color="#a4b0be" style={[styles.inputIcon, styles.textAreaIcon]} />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile?.bio}
                onChangeText={(t) => setProfile({ ...profile, bio: t })}
                multiline
                numberOfLines={4}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#a4b0be"
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionSection}>
          {/* Worker Login Button */}
          <TouchableOpacity 
            style={styles.workerLoginButton}
            onPress={() => router.push('/(tabs)/worker')}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="briefcase-outline" size={24} color="#fff" />
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>Worker Portal</Text>
                <Text style={styles.buttonSubtitle}>Access work assignments</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={saveProfile}
            disabled={loading}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>
                {loading ? "Saving..." : "Save Changes"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingSpinner: {
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#74b9ff",
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#f8f9fa",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2d3436",
  },
  logoutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f1f2f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#e1e5e9",
    borderStyle: "dashed",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#74b9ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarHint: {
    fontSize: 14,
    color: "#a4b0be",
    fontWeight: "500",
  },
  formSection: {
    marginBottom: 20,
  },
  actionSection: {
    marginBottom: 30,
    gap: 16,
  },
  workerLoginButton: {
    backgroundColor: "#6c5ce7",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: "#6c5ce7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  buttonTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  buttonSubtitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
    opacity: 0.9,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  textAreaContainer: {
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  textAreaIcon: {
    marginTop: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2d3436",
    paddingVertical: 12,
    fontWeight: "500",
  },
  disabledInput: {
    color: "#a4b0be",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  workerButton: {
    backgroundColor: "#6c5ce7",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#6c5ce7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  workerButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  workerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginLeft: 12,
  },
  saveButton: {
    backgroundColor: "#00b894",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#00b894",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: "#a4b0be",
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});