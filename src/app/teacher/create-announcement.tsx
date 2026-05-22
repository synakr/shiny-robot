import { useState } from "react";

import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft } from "lucide-react-native";

import { router } from "expo-router";

import FormInput from "@/components/FormInput";

import { useAuthStore } from "@/store/authStore";

import { createAnnouncement } from "@/services/announcements";

export default function CreateAnnouncementScreen() {
  const { teacher } = useAuthStore();

  const [title, setTitle] = useState("");

  const [message, setMessage] = useState("");

  const [batchName, setBatchName] = useState("");

  async function handlePublish() {
    if (!title) {
      Alert.alert("Required", "Please enter title.");

      return;
    }

    const response = await createAnnouncement({
      teacherId: teacher?.id || "",

      title,

      message,

      batchName,
    });

    if (!response.success) {
      Alert.alert("Error", response.error?.message);

      return;
    }

    Alert.alert("Success", "Announcement published.");

    router.back();
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
            paddingBottom: 140,
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
                  fontSize: 26,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Create Announcement
              </Text>
            </View>
          </View>

          {/* FORM */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 28,
            }}>
            <FormInput
              label="Title"
              placeholder="Enter announcement title"
              value={title}
              onChangeText={setTitle}
            />

            <FormInput
              label="Message"
              placeholder="Write announcement..."
              multiline
              value={message}
              onChangeText={setMessage}
            />

            <FormInput
              label="Batch"
              placeholder="Eg. GT12A"
              value={batchName}
              onChangeText={setBatchName}
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
            onPress={handlePublish}
            style={{
              height: 56,
              borderRadius: 18,
              backgroundColor: "#6C63FF",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                color: "#FFF",
                fontSize: 16,
                fontWeight: "700",
              }}>
              Publish Announcement
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
