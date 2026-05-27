import { TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft } from "lucide-react-native";

import { router, useLocalSearchParams } from "expo-router";

import { WebView } from "react-native-webview";

export default function VideoPlayerScreen() {
  const params = useLocalSearchParams();

  const videoId = params.videoId as string;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}>
      {/* BACK */}
      <View
        style={{
          position: "absolute",
          top: 14,
          left: 16,
          zIndex: 10,
        }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.15)",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <ArrowLeft size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <WebView
        source={{
          uri: `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0`,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={["*"]}
        style={{
          flex: 1,
        }}
      />
    </SafeAreaView>
  );
}
