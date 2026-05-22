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

import { ArrowLeft } from "lucide-react-native";

import { router } from "expo-router";

import { supabase } from "@/lib/supabase";

import { useAuthStore } from "@/store/authStore";

export default function AddStudentScreen() {
  const { teacher } = useAuthStore();

  const [studentName, setStudentName] = useState("");

  const [className, setClassName] = useState("");

  const [batchName, setBatchName] = useState("");

  const [phone, setPhone] = useState("");

  const [parentPhone, setParentPhone] = useState("");

  async function handleAddStudent() {
    if (!studentName || !className) {
      Alert.alert("Required", "Please fill required fields.");

      return;
    }

    const response = await supabase.from("students").insert({
      teacher_id: teacher?.id,

      student_name: studentName,

      class_name: className,

      batch_name: batchName,

      phone,

      parent_phone: parentPhone,
    });

    if (response.error) {
      Alert.alert("Error", response.error.message);

      return;
    }

    Alert.alert("Success", "Student added successfully.");

    router.back();
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
          paddingBottom: 120,
        }}>
        {/* HEADER */}
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
            Add Student
          </Text>
        </View>

        {/* FORM */}
        <View
          style={{
            marginTop: 28,
            gap: 16,
          }}>
          <Input
            label="Student Name"
            value={studentName}
            onChangeText={setStudentName}
          />

          <Input label="Class" value={className} onChangeText={setClassName} />

          <Input label="Batch" value={batchName} onChangeText={setBatchName} />

          <Input label="Phone" value={phone} onChangeText={setPhone} />

          <Input
            label="Parent Phone"
            value={parentPhone}
            onChangeText={setParentPhone}
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleAddStudent}
          style={{
            height: 58,
            borderRadius: 18,
            backgroundColor: "#6C63FF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 34,
          }}>
          <Text
            style={{
              color: "#FFF",
              fontSize: 16,
              fontWeight: "700",
            }}>
            Add Student
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Input({
  label,
  value,
  onChangeText,
}: {
  label: string;

  value: string;

  onChangeText: (text: string) => void;
}) {
  return (
    <View>
      <Text
        style={{
          marginBottom: 8,
          fontSize: 14,
          fontWeight: "600",
          color: "#374151",
        }}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#9CA3AF"
        style={{
          height: 54,
          borderRadius: 16,
          backgroundColor: "#FFF",
          paddingHorizontal: 16,
          fontSize: 15,
          color: "#111827",
        }}
      />
    </View>
  );
}
