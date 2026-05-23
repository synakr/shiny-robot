import {
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useCallback, useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";

import { router } from "expo-router";

import FilterChip from "@/components/FilterChip";

import StudentCard from "@/components/StudentCard";

import { useAuthStore } from "@/store/authStore";

import { getStudentsByTeacher } from "@/services/students";

export default function StudentsScreen() {
  const { teacher } = useAuthStore();

  const [students, setStudents] = useState<any[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const loadStudents = useCallback(async () => {
    if (!teacher?.id) return;

    const response = await getStudentsByTeacher(teacher.id);

    if (response.success) {
      setStudents(response.data || []);
    }
  }, [teacher]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  async function onRefresh() {
    setRefreshing(true);

    await loadStudents();

    setRefreshing(false);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 220,
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
                  Students
                </Text>
              </View>

              <TouchableOpacity>
                <SlidersHorizontal size={22} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {/* SEARCH */}
            <View
              style={{
                marginTop: 22,
                height: 54,
                borderRadius: 18,
                backgroundColor: "#FFF",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
              }}>
              <Search size={20} color="#98A2B3" />

              <TextInput
                placeholder="Search students..."
                placeholderTextColor="#98A2B3"
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 15,
                  color: "#111827",
                }}
              />
            </View>
          </View>

          {/* FILTERS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              marginTop: 18,
              paddingBottom: 4,
            }}>
            <FilterChip label="All" active />

            <FilterChip label="Paid" />

            <FilterChip label="Pending" />

            <FilterChip label="JEE" />

            <FilterChip label="NEET" />
          </ScrollView>

          {/* QUICK STATS */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              marginTop: 16,
              gap: 12,
            }}>
            <StatBox
              title="Total"
              value={`${students.length}`}
              color="#6C63FF"
              bg="#EEE8FF"
            />

            <StatBox
              title="Paid"
              value={`${
                students.filter((student) => student.payment_status === "Paid")
                  .length
              }`}
              color="#10B981"
              bg="#DCFCE7"
            />

            <StatBox
              title="Pending"
              value={`${
                students.filter((student) => student.payment_status !== "Paid")
                  .length
              }`}
              color="#F59E0B"
              bg="#FEF3C7"
            />
          </View>

          {/* LIST */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 20,
            }}>
            {students.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 24,
                  padding: 30,
                  alignItems: "center",
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#111827",
                  }}>
                  No Students Found
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "#667085",
                    textAlign: "center",
                  }}>
                  Add students to start managing your batches
                </Text>
              </View>
            ) : (
              students.map((student, index) => (
                <StudentCard
                  key={index}
                  name={student.student_name}
                  className={student.class_name}
                  batchName={student.batch_name}
                  batchId={student.batch_id}
                  attendance={`${student.attendance || 0}`}
                  tasksCompleted={student.tasks_completed || 0}
                  performanceScore={student.performance_score || 0}
                  rank={student.rank || 0}
                  payment={student.payment_status || "Pending"}
                  paid={student.payment_status === "Paid"}
                  phone={student.phone}
                  parentPhone={student.parent_phone}
                  onPress={() =>
                    router.push({
                      pathname: "/teacher/student-details",

                      params: {
                        id: student.id,

                        name: student.student_name,

                        className: student.class_name,

                        batch: student.batch_name,

                        batchId: student.batch_id,

                        phone: student.phone,

                        performance: student.performance_score,

                        attendance: student.attendance,

                        tasks: student.tasks_completed,

                        rank: student.rank,
                      },
                    })
                  }
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          onPress={() => router.push("/teacher/add-student")}
          style={{
            position: "absolute",
            right: 20,
            bottom: 100,
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

function StatBox({
  title,
  value,
  color,
  bg,
}: {
  title: string;

  value: string;

  color: string;

  bg: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg,
        borderRadius: 18,
        paddingVertical: 10,
        alignItems: "center",
      }}>
      <Text
        style={{
          fontSize: 12,
          color,
          fontWeight: "600",
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 18,
          fontWeight: "800",
          color: "#111827",
        }}>
        {value}
      </Text>
    </View>
  );
}
