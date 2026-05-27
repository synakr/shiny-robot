import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ClipboardList } from "lucide-react-native";

import { router } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { getAssignmentsForStudent } from "@/services/test-assignments";

export default function TestsScreen() {
  const { student } = useAuthStore();

  const [assignments, setAssignments] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTests() {
      if (!student) return;

      const response = await getAssignmentsForStudent({
        student,
      });

      if (response.success) {
        setAssignments(response.data || []);
      }

      setLoading(false);
    }

    loadTests();
  }, [student]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 180,
        }}>
        {/* HEADER */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 16,
          }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "800",
              color: "#111827",
            }}>
            Tests
          </Text>
        </View>

        {/* LIST */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 24,
          }}>
          {!loading && assignments.length === 0 ? (
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
                No Tests
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "#667085",
                  textAlign: "center",
                  lineHeight: 20,
                }}>
                Published tests will appear here.
              </Text>
            </View>
          ) : (
            assignments.map((assignment) => {
              const test = assignment.tests;

              return (
                <TouchableOpacity
                  key={assignment.id}
                  activeOpacity={0.9}
                  onPress={() =>
                    router.push({
                      pathname: "/student/test-details",

                      params: {
                        assignmentId: assignment.id,

                        testId: test.id,
                      },
                    })
                  }
                  style={{
                    backgroundColor: "#FFF",
                    borderRadius: 24,
                    padding: 18,
                    marginBottom: 16,
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "800",
                      color: "#111827",
                    }}>
                    {test.title}
                  </Text>

                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 13,
                      color: "#667085",
                    }}>
                    {test.total_questions} Questions • {test.duration_minutes}{" "}
                    Min
                  </Text>

                  <TouchableOpacity
                    style={{
                      marginTop: 16,
                      backgroundColor: "#6C63FF",
                      paddingVertical: 12,
                      borderRadius: 14,
                      alignItems: "center",
                    }}>
                    <Text
                      style={{
                        color: "#FFF",
                        fontWeight: "700",
                      }}>
                      Open Test
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
