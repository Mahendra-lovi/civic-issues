// app/home.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/services/supabaseclient";

export default function HomeScreen() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAvatar = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      if (profile?.avatar_url) {
        const { data: signed } = await supabase.storage
          .from("avatars")
          .createSignedUrl(profile.avatar_url, 60 * 60);
        if (signed?.signedUrl) setAvatarUrl(signed.signedUrl);
      }
    };

    fetchAvatar();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Civic Issues</Text>

      <View style={styles.buttons}>
        <Link href="/report" asChild>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Report an Issue</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/past" asChild>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Past Reported Issues</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <TouchableOpacity
        style={styles.avatarWrap}
        onPress={() => router.push("/profile")
}
      >
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <Text>👤</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  buttons: { gap: 15 },
  btn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  avatarWrap: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%" },
});
