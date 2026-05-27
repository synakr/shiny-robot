import { useState } from "react";

import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { WebView } from "react-native-webview";

export default function TestYoutubeScreen() {
  const [url, setUrl] = useState("");

  const [videoId, setVideoId] = useState("");

  function extractVideoId(youtubeUrl: string) {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=))([^#&?]*).*/;

    const match = youtubeUrl.match(regExp);

    return match && match[7].length === 11 ? match[7] : null;
  }

  function handleLoadVideo() {
    if (!url) {
      Alert.alert("Required", "Please paste a YouTube video link.");

      return;
    }

    const extractedId = extractVideoId(url);

    if (!extractedId) {
      Alert.alert("Invalid Link", "Could not detect video ID.");

      return;
    }

    console.log("VIDEO ID:", extractedId);

    setVideoId(extractedId);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 100,
        }}>
        {/* HEADER */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: "#111827",
          }}>
          YouTube Test
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
            lineHeight: 22,
            color: "#667085",
          }}>
          Paste any YouTube video URL and test whether it can play inside iframe
          WebView.
        </Text>

        {/* INPUT */}
        <TextInput
          placeholder="Paste YouTube video URL"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            marginTop: 28,
            backgroundColor: "#FFF",
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 16,
            fontSize: 15,
            color: "#111827",
          }}
        />

        {/* BUTTON */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleLoadVideo}
          style={{
            marginTop: 16,
            height: 56,
            borderRadius: 18,
            backgroundColor: "#DC2626",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text
            style={{
              color: "#FFF",
              fontSize: 16,
              fontWeight: "700",
            }}>
            Test Video
          </Text>
        </TouchableOpacity>

        {/* PLAYER */}
        {videoId ? (
          <View
            style={{
              marginTop: 28,
              height: 260,
              borderRadius: 24,
              overflow: "hidden",
              backgroundColor: "#000",
            }}>
            <WebView
              originWhitelist={["*"]}
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
                      />
                      <style>
                        html, body {
                          margin: 0;
                          padding: 0;
                          width: 100%;
                          height: 100%;
                          overflow: hidden;
                          background: black;
                        }

                        iframe {
                          position: absolute;
                          top: 0;
                          left: 0;
                          width: 100%;
                          height: 100%;
                          border: 0;
                        }
                      </style>
                    </head>

                    <body>
                      <iframe
                        src="https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      ></iframe>
                    </body>
                  </html>
                `,
              }}
              style={{
                flex: 1,
                backgroundColor: "#000",
              }}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
