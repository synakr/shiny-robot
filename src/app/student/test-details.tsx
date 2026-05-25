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

export default function TestDetailsScreen() {
  const { testId } = useLocalSearchParams();

  const [test, setTest] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTest() {
      const response = await supabase
        .from("tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (response.data) {
        setTest(response.data);
      }

      setLoading(false);
    }

    loadTest();
  }, [testId]);

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
          backgroundColor: "#F8F8F8",
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

            {test.description ? (
              <Text
                style={{
                  marginTop: 14,
                  fontSize: 14,
                  lineHeight: 24,
                  color: "#667085",
                }}>
                {test.description}
              </Text>
            ) : null}

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

            {/* TARGET */}
            <View
              style={{
                marginTop: 24,
                alignSelf: "flex-start",
                backgroundColor: "#EEF2FF",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 14,
              }}>
              <Text
                style={{
                  color: "#4F46E5",
                  fontSize: 13,
                  fontWeight: "700",
                }}>
                {getTargetLabel(test)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* START BUTTON */}
        <View
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 24,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/student/attempt-test",

                params: {
                  testId: test.id,
                },
              })
            }
            style={{
              height: 58,
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
              Start Test
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

function getTargetLabel(test: any) {
  if (test.target_type === "all") {
    return "All Students";
  }

  if (test.target_type === "batch") {
    return test.batch_name;
  }

  if (test.target_type === "class") {
    return `Class ${test.class_name}`;
  }

  if (test.target_type === "category") {
    return test.batch_category;
  }

  return "Students";
}
