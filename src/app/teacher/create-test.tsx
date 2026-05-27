import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft } from "lucide-react-native";

import { router } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { parseTestText } from "@/utils/test-parser";

import { createTest } from "@/services/tests";

export default function CreateTestScreen() {
  const { teacher } = useAuthStore();

  const [title, setTitle] = useState("");

  const [duration, setDuration] = useState("60");

  const [rawQuestions, setRawQuestions] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleCreateTest() {
    if (!title || !rawQuestions) {
      Alert.alert("Required", "Fill all fields.");

      return;
    }

    try {
      setLoading(true);

      const parsedQuestions = parseTestText(rawQuestions);

      if (!parsedQuestions.length) {
        Alert.alert("Error", "Invalid format.");

        return;
      }

      console.log("Test create-task Parsed Qs");

      const response = await createTest({
        teacherId: teacher?.id || "",

        title,

        durationMinutes: Number(duration),

        questions: parsedQuestions,
      });
      console.log("Test create-task response");

      if (!response.success) {
        Alert.alert("Error", "Failed to create test.");

        return;
      }

      Alert.alert("Success", "Test created.");

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
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Create Test
              </Text>
            </View>
          </View>

          {/* FORM */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 28,
            }}>
            <InputLabel label="Test Title" />

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Mock Test"
              placeholderTextColor="#98A2B3"
              style={inputStyle}
            />

            <InputLabel label="Duration (Minutes)" />

            <TextInput
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholder="60"
              placeholderTextColor="#98A2B3"
              style={inputStyle}
            />

            <InputLabel label="Paste Questions" />

            <TextInput
              value={rawQuestions}
              onChangeText={setRawQuestions}
              multiline
              textAlignVertical="top"
              placeholder={`Qs 1. Which planet is known as Red Planet?

Image: https://image-url.com

a. Earth [Earth is blue]
b. Mars [Correct answer]
c. Venus
d. Jupiter

Ans: b`}
              placeholderTextColor="#98A2B3"
              style={{
                ...inputStyle,

                height: 360,

                paddingTop: 16,
              }}
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
            onPress={handleCreateTest}
            style={{
              height: 58,
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
              {loading ? "Creating..." : "Create Test"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function InputLabel({ label }: { label: string }) {
  return (
    <Text
      style={{
        marginBottom: 10,
        marginTop: 18,
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
      }}>
      {label}
    </Text>
  );
}

const inputStyle = {
  backgroundColor: "#FFF",

  borderRadius: 18,

  paddingHorizontal: 16,

  paddingVertical: 16,

  fontSize: 15,

  color: "#111827",

  borderWidth: 1,

  borderColor: "#E5E7EB",
};
