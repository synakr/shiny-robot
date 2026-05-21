import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, BookOpen, Phone, User, Users } from "lucide-react-native";

import { router } from "expo-router";

import AuthInput from "@/components/AuthInput";
import SelectBox from "@/components/SelectBox";

export default function AdmissionScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 60,
        }}>
        <View
          style={{
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
              marginTop: 36,
            }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: "#111827",
              }}>
              Admission Form
            </Text>

            <Text
              style={{
                marginTop: 10,
                fontSize: 15,
                lineHeight: 24,
                color: "#667085",
              }}>
              Fill the details below to apply for admission.
            </Text>
          </View>

          {/* FORM */}
          <View
            style={{
              marginTop: 38,
            }}>
            <AuthInput placeholder="Student Name" icon={User} />

            <AuthInput placeholder="Mobile Number" icon={Phone} />

            <AuthInput placeholder="Parent Mobile Number" icon={Users} />

            <SelectBox label="Select Class" value="Class 11" />

            <SelectBox label="Course Interested" value="JEE Foundation Batch" />

            <AuthInput placeholder="School Name" icon={BookOpen} />
          </View>

          {/* SUBMIT */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              height: 58,
              borderRadius: 18,
              backgroundColor: "#F59E0B",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 18,
            }}>
            <Text
              style={{
                color: "#FFF",
                fontSize: 16,
                fontWeight: "700",
              }}>
              Submit Application
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
