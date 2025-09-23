// app/home.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/services/supabaseclient";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

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

  // Floating background icons animation
  const floatY = useSharedValue(0);
  useEffect(() => {
    floatY.value = withRepeat(withTiming(15, { duration: 4000 }), -1, true);
  }, []);
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  // Glass button with effects
  const GlassButton = ({ text, onPress, color }: any) => {
    const scale = useSharedValue(1);
    const glow = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      shadowOpacity: glow.value,
    }));

    return (
      <TouchableWithoutFeedback
        onPressIn={() => {
          scale.value = withSpring(0.95);
          glow.value = withTiming(0.35, { duration: 200 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
          glow.value = withTiming(0, { duration: 300 });
          onPress?.();
        }}
      >
        <Animated.View
          style={[
            styles.glassBtn,
            animatedStyle,
            { shadowColor: color, shadowRadius: 16 },
          ]}
        >
          <BlurView intensity={60} tint="light" style={styles.blur}>
            <Text style={[styles.btnText, { color }]}>{text}</Text>
          </BlurView>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Half - Report */}
      <Animated.View
        entering={FadeInDown.duration(900).springify()}
        style={styles.half}
      >
        <LinearGradient
          colors={["rgba(255,90,90,0.25)", "rgba(255,0,0,0.35)"]}
          style={styles.fill}
        >
          <BlurView intensity={70} tint="light" style={styles.panel}>
            <Animated.View style={[styles.bgIcon, floatStyle]}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={120}
                color="rgba(255,80,80,0.2)"
              />
            </Animated.View>
            <Text style={styles.title}>Report an Issue</Text>
            <Text style={styles.desc}>
              Raise urgent concerns instantly with clarity.
            </Text>
            <Link href="/report" asChild>
              <GlassButton text="Start Reporting" color="#FF3B3B" />
            </Link>
          </BlurView>
        </LinearGradient>
      </Animated.View>

      {/* Bottom Half - Achievements */}
      <Animated.View
        entering={FadeInUp.duration(900).springify()}
        style={styles.half}
      >
        <LinearGradient
          colors={["rgba(80,220,255,0.25)", "rgba(0,180,255,0.35)"]}
          style={styles.fill}
        >
          <BlurView intensity={70} tint="light" style={styles.panel}>
            <Animated.View style={[styles.bgIcon, floatStyle]}>
              <Ionicons
                name="trophy-outline"
                size={120}
                color="rgba(50,180,255,0.2)"
              />
            </Animated.View>
            <Text style={styles.title}>Past Reports</Text>
            <Text style={styles.desc}>
              Review your previously submitted reports.
            </Text>
            <Link href="/past" asChild>
              <GlassButton text="View Past Reports" color="#0099FF" />
            </Link>
          </BlurView>
        </LinearGradient>
      </Animated.View>

      {/* Avatar */}
      <TouchableWithoutFeedback onPress={() => router.push("/profile")}>
        <View style={styles.avatarWrap}>
          <BlurView intensity={80} tint="light" style={styles.avatarBlur}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <Text style={{ fontSize: 20 }}>👤</Text>
            )}
          </BlurView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  half: { flex: 1 },
  fill: { flex: 1 },
  panel: {
    flex: 1,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111",
    marginBottom: 8,
    textAlign: "center",
  },
  desc: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
    maxWidth: "85%",
  },
  glassBtn: {
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
  },
  blur: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200,
  },
  btnText: {
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.7,
  },
  avatarWrap: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 27.5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  avatarBlur: {
    flex: 1,
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: { width: "100%", height: "100%" },
  bgIcon: {
    position: "absolute",
    top: "30%",
    opacity: 0.2,
  },
});
