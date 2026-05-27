import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { FileText, Plus } from "lucide-react-native";

import { router } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { getTestsByTeacher } from "@/services/tests";

import { assignTest } from "@/services/test-assignments";

export default function TestsScreen() {
  const { teacher } = useAuthStore();

  const [tests, setTests] = useState<any[]>([]);

  const [publishingId, setPublishingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadTests() {
      if (!teacher) return;

      const response = await getTestsByTeacher(teacher.id);

      if (response.success) {
        setTests(response.data || []);
      }
    }

    loadTests();
  }, [teacher]);

  async function handlePublishTest(test: any) {
    try {
      setPublishingId(test.id);

      const response = await assignTest({
        testId: test.id,

        teacherId: teacher?.id || "",

        targetType: "all",
      });

      if (!response.success) {
        Alert.alert("Error", "Failed to publish test.");

        return;
      }

      Alert.alert("Success", "Test published successfully.");
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setPublishingId(null);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
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
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "800",
              color: "#111827",
            }}>
            Tests
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/teacher/create-test")}
            style={{
              width: 52,
              height: 52,
              borderRadius: 18,
              backgroundColor: "#6C63FF",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Plus size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* LIST */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 28,
          }}>
          {tests.length === 0 ? (
            <View
              style={{
                backgroundColor: "#FFF",
                borderRadius: 28,
                padding: 34,
                alignItems: "center",
              }}>
              <FileText size={46} color="#98A2B3" />

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
                Create your first test to get started.
              </Text>
            </View>
          ) : (
            tests.map((test) => (
              <View
                key={test.id}
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 18,
                      backgroundColor: "#EEE8FF",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 14,
                    }}>
                    <FileText size={24} color="#6C63FF" />
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "800",
                        color: "#111827",
                      }}>
                      {test.title}
                    </Text>

                    <Text
                      style={{
                        marginTop: 6,
                        fontSize: 13,
                        color: "#667085",
                      }}>
                      {test.total_questions} Questions
                    </Text>
                  </View>
                </View>

                {/* PUBLISH BUTTON */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={publishingId === test.id}
                  onPress={() => handlePublishTest(test)}
                  style={{
                    marginTop: 18,

                    height: 48,

                    borderRadius: 16,

                    backgroundColor: "#6C63FF",

                    justifyContent: "center",

                    alignItems: "center",

                    opacity: publishingId === test.id ? 0.7 : 1,
                  }}>
                  <Text
                    style={{
                      color: "#FFF",

                      fontSize: 14,

                      fontWeight: "700",
                    }}>
                    {publishingId === test.id
                      ? "Publishing..."
                      : "Publish Test"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
