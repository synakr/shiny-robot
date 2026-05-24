import { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowRight, Building2 } from "lucide-react-native";

import { router } from "expo-router";

import { supabase } from "@/lib/supabase";

export default function AdmissionInstituteScreen() {
  const [instituteName, setInstituteName] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!instituteName.trim()) {
      Alert.alert("Required", "Please enter institute name.");

      return;
    }

    try {
      setLoading(true);

      const response = await supabase
        .from("teachers")
        .select("*")
        .ilike("institute_name", instituteName.trim())
        .single();

      if (response.error || !response.data) {
        Alert.alert(
          "Institute Not Found",
          "No institute found with this name.",
        );

        return;
      }

      router.push({
        pathname: "/auth/admission",

        params: {
          teacherId: response.data.id,

          institute: response.data.institute_name,
        },
      });
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            justifyContent: "center",
          }}>
          {/* ICON */}
          <View
            style={{
              width: 82,
              height: 82,
              borderRadius: 28,
              backgroundColor: "#EEF2FF",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}>
            <Building2 size={38} color="#4F46E5" />
          </View>

          {/* TITLE */}
          <Text
            style={{
              marginTop: 30,
              fontSize: 30,
              fontWeight: "800",
              color: "#111827",
              textAlign: "center",
            }}>
            Admission Portal
          </Text>

          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              lineHeight: 24,
              color: "#6B7280",
              textAlign: "center",
            }}>
            Enter your institute name to continue with admission.
          </Text>

          {/* INPUT */}
          <View
            style={{
              marginTop: 36,
            }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 14,
                fontWeight: "700",
                color: "#111827",
              }}>
              Institute Name {}
            </Text>

            <TextInput
              value={instituteName}
              onChangeText={setInstituteName}
              placeholder={`Enter ${"KunVerse"}`}
              placeholderTextColor="#9CA3AF"
              style={{
                height: 58,
                borderRadius: 18,
                backgroundColor: "#FFF",
                paddingHorizontal: 18,
                fontSize: 15,
                color: "#111827",
              }}
            />
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={loading}
            onPress={handleContinue}
            style={{
              marginTop: 26,
              height: 58,
              borderRadius: 18,
              backgroundColor: "#4F46E5",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                color: "#FFF",
                fontSize: 16,
                fontWeight: "700",
              }}>
              {loading ? "Checking..." : "Continue"}
            </Text>

            {!loading && (
              <ArrowRight
                size={18}
                color="#FFF"
                style={{
                  marginLeft: 8,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
