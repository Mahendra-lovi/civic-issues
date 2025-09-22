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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/services/supabaseclient";
import { useRouter } from "expo-router"; // ✅ import router for navigation

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const router = useRouter(); // ✅ setup router

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
      mediaTypes: ["images"], // ✅
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri); // local file URI
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

      console.log("USER FROM SUPABASE (on save):", user);

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

      Alert.alert("Success", "Profile updated!");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sign out handler
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      router.replace("/auth/signin"); // ✅ redirect to signin
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Text style={{ color: "#888" }}>📷 Add Avatar</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={profile?.email} editable={false} />

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={profile?.full_name}
        onChangeText={(t) => setProfile({ ...profile, full_name: t })}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={profile?.phone}
        onChangeText={(t) => setProfile({ ...profile, phone: t })}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={profile?.address}
        onChangeText={(t) => setProfile({ ...profile, address: t })}
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={profile?.bio}
        onChangeText={(t) => setProfile({ ...profile, bio: t })}
        multiline
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
        <Text style={styles.saveText}>Save Profile</Text>
      </TouchableOpacity>

      {/* ✅ New Sign Out button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: "center" },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%" },
  label: { alignSelf: "flex-start", marginTop: 12, fontWeight: "600" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "600" },
  logoutBtn: {
    marginTop: 12,
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
