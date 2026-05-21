import { Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Lock, Mail } from "lucide-react-native";

import { router } from "expo-router";

import AuthInput from "@/components/AuthInput";

export default function StudentLoginScreen() {
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
            Student Login
          </Text>

          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              lineHeight: 24,
              color: "#667085",
            }}>
            Login to access your courses, tasks and notes.
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
            Login
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

          <TouchableOpacity onPress={() => router.push("/auth/admission")}>
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
