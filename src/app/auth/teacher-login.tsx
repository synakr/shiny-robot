import { useState } from "react";

import { Alert, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Lock, Mail } from "lucide-react-native";

import { router } from "expo-router";

import AuthInput from "@/components/AuthInput";

import { teacherLogin } from "@/services/auth";

import { getCurrentTeacher } from "@/services/teacher";

import { useAuthStore } from "@/store/authStore";

export default function TeacherLoginScreen() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleTeacherLogin() {
    if (!email || !password) {
      Alert.alert("Required", "Please fill all fields.");

      return;
    }

    try {
      setLoading(true);

      const response = await teacherLogin(email, password);

      if (!response.success) {
        Alert.alert("Login Failed", response.error || "Invalid credentials.");

        return;
      }

      const authUser = response.data?.user;

      if (!authUser) {
        Alert.alert("Login Failed", "User not found.");

        return;
      }

      const teacherResponse = await getCurrentTeacher(authUser.id);

      if (!teacherResponse.success || !teacherResponse.data) {
        Alert.alert("Teacher Profile Missing", "No teacher profile found.");

        return;
      }

      const {
        setUser,
        setRole,
        setTeacher,
        setStudent,
      } = useAuthStore.getState();

      setUser(authUser);

      setStudent(null);

      setRole("teacher");

      setTeacher(teacherResponse.data);

      router.replace("/teacher/dashboard");
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
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 18,
        }}>
        {/* BACK */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor: "#FFF",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>

        {/* HEADER */}
        <View
          style={{
            marginTop: 42,
          }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: "#111827",
            }}>
            Teacher Login
          </Text>

          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              lineHeight: 24,
              color: "#667085",
            }}>
            Manage students, batches and courses easily.
          </Text>
        </View>

        {/* FORM */}
        <View
          style={{
            marginTop: 42,
          }}>
          <AuthInput
            placeholder="Email"
            icon={Mail}
            value={email}
            onChangeText={setEmail}
          />

          <AuthInput
            placeholder="Password"
            icon={Lock}
            secure
            value={password}
            onChangeText={setPassword}
          />

          {/* FORGOT */}
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
            }}>
            <Text
              style={{
                color: "#10B981",
                fontSize: 14,
                fontWeight: "600",
              }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={loading}
          onPress={handleTeacherLogin}
          style={{
            height: 58,
            borderRadius: 18,
            backgroundColor: "#10B981",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
            opacity: loading ? 0.7 : 1,
          }}>
          <Text
            style={{
              color: "#FFF",
              fontSize: 16,
              fontWeight: "700",
            }}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
