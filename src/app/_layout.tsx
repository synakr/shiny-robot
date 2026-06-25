import { RefreshProvider } from "@/context/RefreshContext";

import { useEffect, useRef, useState } from "react";

import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { Stack } from "expo-router";

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <StartupAnimation onFinish={() => setSplashDone(true)} />;
  }

  return (
  <RefreshProvider>
    <Stack screenOptions={{ headerShown: false }} />
  </RefreshProvider>
);
}

function StartupAnimation({ onFinish }: { onFinish: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;

  const scale = useRef(new Animated.Value(0.75)).current;

  const translateY = useRef(new Animated.Value(20)).current;

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }),

      Animated.timing(translateY, {
        toValue: 0,
        duration: 650,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 650,
          useNativeDriver: true,
        }),

        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    const timer = setTimeout(() => {
      pulseAnimation.stop();

      onFinish();
    }, 2300);

    return () => {
      clearTimeout(timer);

      pulseAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoBox,
          {
            opacity,
            transform: [{ scale: Animated.multiply(scale, pulse) }],
          },
        ]}>
        <Text style={styles.logoText}>L</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.textBox,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}>
        <Text style={styles.appName}>Lance</Text>

        <Text style={styles.tagline}>Learn. Manage. Grow.</Text>
      </Animated.View>

      <Animated.Text
        style={[
          styles.loadingText,
          {
            opacity,
          },
        ]}>
        Starting app...
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },

  logoBox: {
    width: 108,
    height: 108,
    borderRadius: 34,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6C63FF",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
  },

  textBox: {
    marginTop: 28,
    alignItems: "center",
  },

  appName: {
    fontSize: 36,
    fontWeight: "900",
    color: "#111827",
  },

  tagline: {
    marginTop: 8,
    fontSize: 15,
    color: "#667085",
    fontWeight: "600",
  },

  loadingText: {
    position: "absolute",
    bottom: 70,
    fontSize: 13,
    color: "#98A2B3",
    fontWeight: "600",
  },
});
