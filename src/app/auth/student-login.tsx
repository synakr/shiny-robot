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

  const [isSignup, setIsSignup] = useState(false);

  const isEmail = emailOrPhone.includes("@");

  async function handleLogin() {
    if (!emailOrPhone || !password) {
      Alert.alert("Required", "Please fill all fields.");

      return;
    }

    try {
      setLoading(true);

      const response = await supabase.auth.signInWithPassword({
        email: isEmail ? emailOrPhone : `${emailOrPhone}@student.app`,

        password,
      });

      if (response.error) {
        Alert.alert("Login Failed", response.error.message);

        return;
      }

      const studentResponse = await supabase
        .from("students")
        .select("*")
        .eq("auth_id", response.data.user.id)
        .single();

      if (studentResponse.error || !studentResponse.data) {
        Alert.alert("Error", "Student profile not found.");

        return;
      }

      const { setUser, setRole, setStudent } = useAuthStore.getState();

      setUser(response.data.user);

      setRole("student");

      setStudent(studentResponse.data);

      Alert.alert("Success", "Login successful.");

      router.replace("/student/(tabs)/home");
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

      const studentResponse = await supabase
        .from("students")
        .select("*")
        .or(`email.eq.${emailOrPhone},phone.eq.${emailOrPhone}`)
        .single();

      if (studentResponse.error || !studentResponse.data) {
        Alert.alert("Not Approved", "You are not admitted yet.");

        return;
      }

      if (studentResponse.data.auth_id) {
        Alert.alert("Account Exists", "Student account already linked.");

        return;
      }

      const email = emailOrPhone.includes("@")
        ? emailOrPhone
        : `${emailOrPhone}@student.app`;

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

      const updatedStudentResponse = await supabase
        .from("students")
        .select("*")
        .eq("id", studentResponse.data.id)
        .single();

      if (updatedStudentResponse.error || !updatedStudentResponse.data) {
        Alert.alert("Error", "Failed to load student profile.");

        return;
      }

      const { setUser, setRole, setStudent } = useAuthStore.getState();

      setUser(authUser);

      setRole("student");

      setStudent(updatedStudentResponse.data);

      Alert.alert("Success", "Account created successfully.");

      router.replace("/student/(tabs)/home");
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
            {isSignup ? "Create Account" : "Student Login"}
          </Text>

          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              lineHeight: 24,
              color: "#667085",
            }}>
            {isSignup
              ? "Create your student account to access classes, tasks and notes."
              : "Login to access your classes, tasks, notes and test series. "}
          </Text>
        </View>

        {/* TOGGLE */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#EEF2FF",
            borderRadius: 16,
            padding: 4,
            marginTop: 32,
          }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsSignup(false)}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 12,
              backgroundColor: !isSignup ? "#FFF" : "transparent",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                color: !isSignup ? "#111827" : "#667085",
                fontSize: 15,
                fontWeight: "700",
              }}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsSignup(true)}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 12,
              backgroundColor: isSignup ? "#FFF" : "transparent",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                color: isSignup ? "#111827" : "#667085",
                fontSize: 15,
                fontWeight: "700",
              }}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* FORM */}
        <View
          style={{
            marginTop: 34,
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

          {!isSignup && (
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
          )}
        </View>

        {/* ACTION BUTTON */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={loading}
          onPress={isSignup ? handleCreateAccount : handleLogin}
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
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
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
