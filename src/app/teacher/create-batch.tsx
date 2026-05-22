import { useState } from "react";

import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft } from "lucide-react-native";

import { router } from "expo-router";

import FormInput from "@/components/FormInput";

import { useAuthStore } from "@/store/authStore";

import { createBatch } from "@/services/batches";

export default function CreateBatchScreen() {
  const { teacher } = useAuthStore();

  const [batchId, setBatchId] = useState("");

  const [batchName, setBatchName] = useState("");

  const [className, setClassName] = useState("");

  const [year, setYear] = useState("");

  async function handleCreateBatch() {
    if (!batchId || !batchName || !className || !year) {
      Alert.alert("Required", "Please fill all fields.");

      return;
    }

    const response = await createBatch({
      teacherId: teacher?.id || "",

      batchId,

      batchName,

      className,

      year,
    });

    if (!response.success) {
      Alert.alert("Error", response.error?.message);

      return;
    }

    Alert.alert("Success", "Batch created successfully.");

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
                Create Batch
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
              label="Batch ID"
              placeholder="GT12JEE26"
              value={batchId}
              onChangeText={setBatchId}
            />

            <FormInput
              label="Batch Name"
              placeholder="JEE"
              value={batchName}
              onChangeText={setBatchName}
            />

            <FormInput
              label="Class"
              placeholder="11"
              value={className}
              onChangeText={setClassName}
            />

            <FormInput
              label="Year"
              placeholder="2026"
              value={year}
              onChangeText={setYear}
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
            onPress={handleCreateBatch}
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
              Create Batch
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
