import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useEffect, useMemo, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, ClipboardList } from "lucide-react-native";

import { router } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { getTestsForStudent } from "@/services/student-tests";

export default function TestsScreen() {
  const { student } = useAuthStore();

  const [tests, setTests] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    async function loadTests() {
      if (!student) return;

      const response = await getTestsForStudent(student);

      if (response.success) {
        setTests(response.data || []);
      }
    }

    loadTests();
  }, [student]);

  const filteredTests = useMemo(() => {
    if (activeTab === "All") {
      return tests;
    }

    if (activeTab === "Completed") {
      return [];
    }

    return tests;
  }, [tests, activeTab]);

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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <TouchableOpacity>
              <ArrowLeft size={28} color="#111827" />
            </TouchableOpacity>

            <Text
              style={{
                marginLeft: 14,
                fontSize: 30,
                fontWeight: "800",
                color: "#111827",
              }}>
              Tests
            </Text>
          </View>
        </View>

        {/* FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            gap: 10,
          }}>
          <FilterPill
            label="All"
            active={activeTab === "All"}
            count={tests.length}
            onPress={() => setActiveTab("All")}
          />

          <FilterPill
            label="Available"
            active={activeTab === "Available"}
            count={tests.length}
            onPress={() => setActiveTab("Available")}
          />

          <FilterPill
            label="Completed"
            active={activeTab === "Completed"}
            count={0}
            onPress={() => setActiveTab("Completed")}
          />
        </ScrollView>

        {/* LIST */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 22,
          }}>
          {filteredTests.length === 0 ? (
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
                Tests from your teacher will appear here.
              </Text>
            </View>
          ) : (
            filteredTests.map((test, index) => (
              <TestCard
                key={index}
                title={test.title}
                questions={`${test.total_questions} Questions`}
                duration={`${test.duration_minutes} Min`}
                target={getTargetLabel(test)}
                onPress={() =>
                  router.push({
                    pathname: "/student/test-details",

                    params: {
                      testId: test.id,
                    },
                  })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TestCard({ title, questions, duration, target, onPress }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
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

        <TouchableOpacity
          style={{
            backgroundColor: "#6C63FF",
            paddingHorizontal: 14,
            paddingVertical: 9,
            borderRadius: 14,
          }}>
          <Text
            style={{
              color: "#FFF",
              fontSize: 12,
              fontWeight: "700",
            }}>
            Start
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function FilterPill({ label, count, active, onPress }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: active ? "#6C63FF" : "#FFF",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
      }}>
      <Text
        style={{
          color: active ? "#FFF" : "#667085",
          fontSize: 14,
          fontWeight: "700",
        }}>
        {label}
      </Text>

      <View
        style={{
          marginLeft: 8,
          minWidth: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: active ? "#8B84FF" : "#EEF2FF",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 6,
        }}>
        <Text
          style={{
            color: active ? "#FFF" : "#4F46E5",
            fontSize: 11,
            fontWeight: "700",
          }}>
          {count}
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
