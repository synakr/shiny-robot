import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Clock3, FileQuestion } from "lucide-react-native";

import { router, useLocalSearchParams } from "expo-router";

import { supabase } from "@/lib/supabase";

import { useAuthStore } from "@/store/authStore";

export default function TestDetailsScreen() {
  const { testId, assignmentId } = useLocalSearchParams();

  const { student } = useAuthStore();

  const [test, setTest] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    async function loadData() {
      // LOAD TEST
      const testResponse = await supabase
        .from("tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (testResponse.data) {
        setTest(testResponse.data);
      }

      // CHECK ATTEMPT
      const attemptResponse = await supabase
        .from("student_tests")
        .select("id")
        .eq("assignment_id", assignmentId)
        .eq("student_id", student?.id || "")
        .single();

      if (attemptResponse.data) {
        setAttempted(true);
      }

      setLoading(false);
    }

    loadData();
  }, [testId, assignmentId, student?.id]);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8F8F8",
        }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </SafeAreaView>
    );
  }

  if (!test) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text>Test not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <View style={{ flex: 1 }}>
        <ScrollView
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
                <ArrowLeft size={26} color="#111827" />
              </TouchableOpacity>

              <Text
                style={{
                  marginLeft: 14,
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Test Details
              </Text>
            </View>
          </View>

          {/* CARD */}
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 28,
              backgroundColor: "#FFF",
              borderRadius: 28,
              padding: 22,
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#111827",
                lineHeight: 34,
              }}>
              {test.title}
            </Text>

            {/* STATS */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 26,
                gap: 12,
              }}>
              <InfoCard
                icon={<FileQuestion size={18} color="#4F46E5" />}
                title="Questions"
                value={`${test.total_questions}`}
              />

              <InfoCard
                icon={<Clock3 size={18} color="#D97706" />}
                title="Duration"
                value={`${test.duration_minutes} Min`}
              />
            </View>

            {attempted && (
              <View
                style={{
                  marginTop: 18,
                  alignSelf: "flex-start",
                  backgroundColor: "#DCFCE7",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 14,
                }}>
                <Text
                  style={{
                    color: "#15803D",
                    fontSize: 13,
                    fontWeight: "700",
                  }}>
                  Already Attempted
                </Text>
              </View>
            )}
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
            onPress={() => {
              if (attempted) {
                router.push({
                  pathname: "/student/test-review",

                  params: {
                    assignmentId,
                  },
                });

                return;
              }

              router.push({
                pathname: "/student/attempt-test",

                params: {
                  testId,
                  assignmentId,
                },
              });
            }}
            style={{
              height: 58,
              borderRadius: 18,
              backgroundColor: attempted ? "#15803D" : "#6C63FF",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                color: "#FFF",
                fontSize: 16,
                fontWeight: "700",
              }}>
              {attempted ? "View Review" : "Start Test"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function InfoCard({ icon, title, value }: any) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F8FAFC",
        borderRadius: 20,
        padding: 16,
      }}>
      {icon}

      <Text
        style={{
          marginTop: 12,
          fontSize: 12,
          color: "#667085",
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 18,
          fontWeight: "800",
          color: "#111827",
        }}>
        {value}
      </Text>
    </View>
  );
}
