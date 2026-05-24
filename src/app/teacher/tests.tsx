import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, ClipboardList, Plus } from "lucide-react-native";

import { router } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { getTestsByTeacher } from "@/services/tests";

export default function TestsScreen() {
  const { teacher } = useAuthStore();

  const [tests, setTests] = useState<any[]>([]);

  useEffect(() => {
    async function loadTests() {
      if (!teacher?.id) return;

      const response = await getTestsByTeacher(teacher.id);

      if (response.success) {
        setTests(response.data || []);
      }
    }

    loadTests();
  }, [teacher]);

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
                justifyContent: "space-between",
              }}>
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
                    fontSize: 28,
                    fontWeight: "800",
                    color: "#111827",
                  }}>
                  Tests
                </Text>
              </View>
            </View>
          </View>

          {/* LIST */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 24,
            }}>
            {tests.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 28,
                  padding: 34,
                  alignItems: "center",
                }}>
                <ClipboardList size={46} color="#98A2B3" />

                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 18,
                    fontWeight: "800",
                    color: "#111827",
                  }}>
                  No Tests Yet
                </Text>

                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: "#667085",
                    textAlign: "center",
                    lineHeight: 20,
                  }}>
                  Create your first test.
                </Text>
              </View>
            ) : (
              tests.map((test, index) => (
                <TestCard
                  key={index}
                  title={test.title}
                  questions={`${test.total_questions} Questions`}
                  duration={`${test.duration_minutes} Min`}
                  target={getTargetLabel(test)}
                  createdAt={formatDate(test.created_at)}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/teacher/create-test")}
          style={{
            position: "absolute",
            right: 20,
            bottom: 28,
            width: 62,
            height: 62,
            borderRadius: 31,
            backgroundColor: "#6C63FF",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 6,
          }}>
          <Plus size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function TestCard({ title, questions, duration, target, createdAt }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      <Text
        style={{
          fontSize: 17,
          fontWeight: "800",
          color: "#111827",
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 8,
          fontSize: 13,
          color: "#667085",
        }}>
        {questions} • {duration}
      </Text>

      <View
        style={{
          marginTop: 14,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <View
          style={{
            backgroundColor: "#EEF2FF",
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 12,
          }}>
          <Text
            style={{
              color: "#4F46E5",
              fontSize: 12,
              fontWeight: "700",
            }}>
            {target}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 12,
            color: "#98A2B3",
          }}>
          {createdAt}
        </Text>
      </View>
    </TouchableOpacity>
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}
