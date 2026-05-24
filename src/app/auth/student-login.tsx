import { useState } from "react";

import { Alert, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Lock, Mail } from "lucide-react-native";

import { router } from "expo-router";

import AuthInput from "@/components/AuthInput";

import { supabase } from "@/lib/supabase";

import { useAuthStore } from "@/store/authStore";

export default function StudentLoginScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const isEmail = emailOrPhone.includes("@");

  async function handleLogin() {
    if (!emailOrPhone || !password) {
      Alert.alert("Required", "Please fill all fields.");

      return;
    }

    try {
      setLoading(true);

      // LOGIN
      const response = await supabase.auth.signInWithPassword({
        email: isEmail ? emailOrPhone : `${emailOrPhone}@student.app`,

        password,
      });

      if (response.error) {
        Alert.alert("Login Failed", response.error.message);

        return;
      }

      // FETCH STUDENT
      const studentResponse = await supabase
        .from("students")
        .select("*")
        .eq("auth_id", response.data.user.id)
        .single();

      if (studentResponse.error || !studentResponse.data) {
        Alert.alert("Error", "Student profile not found.");

        return;
      }

      // SAVE GLOBALLY
      const { setUser, setRole, setStudent } = useAuthStore.getState();

      setUser(response.data.user);

      setRole("student");

      setStudent(studentResponse.data);

      Alert.alert("Success", "Login successful.");

      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAccount() {
    if (!emailOrPhone || !password) {
      Alert.alert("Required", "Please fill all fields.");

      return;
    }

    try {
      setLoading(true);

      // FIRST FIND STUDENT
      const studentResponse = await supabase
        .from("students")
        .select("*")
        .or(`email.eq.${emailOrPhone},phone.eq.${emailOrPhone}`)
        .single();

      if (studentResponse.error || !studentResponse.data) {
        Alert.alert("Not Approved", "You are not admitted yet.");

        return;
      }

      // CHECK IF ALREADY LINKED
      if (studentResponse.data.auth_id) {
        Alert.alert("Account Exists", "Student account already linked.");

        return;
      }

      const email = emailOrPhone.includes("@")
        ? emailOrPhone
        : `${emailOrPhone}@student.app`;

      // CREATE AUTH ACCOUNT
      const authResponse = await supabase.auth.signUp({
        email,
        password,
      });

      if (authResponse.error) {
        Alert.alert("Signup Failed", authResponse.error.message);

        return;
      }

      const authUser = authResponse.data.user;

      if (!authUser) {
        Alert.alert("Error", "Account creation failed.");

        return;
      }

      // LINK ACCOUNT
      const linkResponse = await supabase
        .from("students")
        .update({
          auth_id: authUser.id,
        })
        .eq("id", studentResponse.data.id);

      if (linkResponse.error) {
        Alert.alert("Error", "Failed to link account.");

        return;
      }

      // FETCH UPDATED STUDENT
      const updatedStudentResponse = await supabase
        .from("students")
        .select("*")
        .eq("id", studentResponse.data.id)
        .single();

      if (updatedStudentResponse.error || !updatedStudentResponse.data) {
        Alert.alert("Error", "Failed to load student profile.");

        return;
      }

      // SAVE GLOBALLY
      const { setUser, setRole, setStudent } = useAuthStore.getState();

      setUser(authUser);

      setRole("student");

      setStudent(updatedStudentResponse.data);

      Alert.alert("Success", "Account created successfully.");

      router.replace("/(tabs)/home");
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
            Student Access
          </Text>

          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              lineHeight: 24,
              color: "#667085",
            }}>
            Login or create your student account to access classes, tasks and
            notes.
          </Text>
        </View>

        {/* FORM */}
        <View
          style={{
            marginTop: 42,
          }}>
          <AuthInput
            placeholder="Email or Mobile Number"
            icon={Mail}
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
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
                color: "#6C63FF",
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
          onPress={handleLogin}
          style={{
            height: 58,
            borderRadius: 18,
            backgroundColor: "#6C63FF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
          }}>
          <Text
            style={{
              color: "#FFF",
              fontSize: 16,
              fontWeight: "700",
            }}>
            {loading ? "Please wait..." : "Login"}
          </Text>
        </TouchableOpacity>

        {/* CREATE ACCOUNT */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={loading}
          onPress={handleCreateAccount}
          style={{
            height: 58,
            borderRadius: 18,
            backgroundColor: "#FFF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 14,
            borderWidth: 1.2,
            borderColor: "#DDE1EB",
          }}>
          <Text
            style={{
              color: "#111827",
              fontSize: 16,
              fontWeight: "700",
            }}>
            Create Account
          </Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 24,
          }}>
          <Text
            style={{
              color: "#667085",
              fontSize: 14,
            }}>
            Need admission?
          </Text>

          <TouchableOpacity onPress={() => router.push("/auth/role-select")}>
            <Text
              style={{
                marginLeft: 6,
                color: "#6C63FF",
                fontWeight: "700",
                fontSize: 14,
              }}>
              Apply Here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
