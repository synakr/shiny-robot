import { useState } from "react";

import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, PlayCircle } from "lucide-react-native";

import { router, useLocalSearchParams } from "expo-router";

import FormInput from "@/components/FormInput";

import { useAuthStore } from "@/store/authStore";

import { supabase } from "@/lib/supabase";

export default function AddPlaylistScreen() {
  const { teacher } = useAuthStore();

  const params = useLocalSearchParams();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [playlistUrl, setPlaylistUrl] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleAddPlaylist() {
    if (!title || !playlistUrl) {
      Alert.alert("Required", "Please fill all required fields.");

      return;
    }

    try {
      setLoading(true);

      const response = await supabase.from("playlists").insert({
        teacher_id: teacher?.id,

        batch_id: params.batchId,

        batch_name: params.batchName,

        title,

        description,

        playlist_url: playlistUrl,
      });

      if (response.error) {
        Alert.alert("Error", response.error.message);

        return;
      }

      Alert.alert("Success", "Playlist added successfully.");

      router.back();
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 350,
          }}>
          {/* HEADER */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 16,
            }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color="#111827" />
              </TouchableOpacity>

              <Text
                style={{
                  marginLeft: 14,
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Add Playlist
              </Text>
            </View>
          </View>

          {/* BATCH CARD */}
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 24,
              backgroundColor: "#FFF",
              borderRadius: 24,
              padding: 18,
              flexDirection: "row",
              alignItems: "center",
            }}>
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 18,
                backgroundColor: "#FEE2E2",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 14,
              }}>
              <PlayCircle size={28} color="#DC2626" />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                {params.batchName}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  color: "#667085",
                }}>
                Playlist will be visible to all students of this batch
              </Text>
            </View>
          </View>

          {/* FORM */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 26,
            }}>
            <FormInput
              label="Playlist Title"
              placeholder="Eg. Electrostatics Lectures"
              value={title}
              onChangeText={setTitle}
            />

            <FormInput
              label="Description"
              placeholder="Optional"
              multiline
              value={description}
              onChangeText={setDescription}
            />

            <FormInput
              label="YouTube Playlist URL"
              placeholder="Paste playlist link"
              value={playlistUrl}
              onChangeText={setPlaylistUrl}
            />
          </View>
        </ScrollView>

        {/* BUTTON */}
        <View
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 24,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={loading}
            onPress={handleAddPlaylist}
            style={{
              height: 58,
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
              {loading ? "Saving..." : "Add Playlist"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
