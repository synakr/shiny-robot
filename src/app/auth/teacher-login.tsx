import { Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Lock, Mail } from "lucide-react-native";

import { router } from "expo-router";

import AuthInput from "@/components/AuthInput";

export default function TeacherLoginScreen() {
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
          <AuthInput placeholder="Email or Mobile Number" icon={Mail} />

          <AuthInput placeholder="Password" icon={Lock} secure />

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
          style={{
            height: 58,
            borderRadius: 18,
            backgroundColor: "#10B981",
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
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
