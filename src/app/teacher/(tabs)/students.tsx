import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useCallback, useEffect, useMemo, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react-native";

import { router } from "expo-router";

import StudentCard from "@/components/StudentCard";

import { useAuthStore } from "@/store/authStore";

import { getStudentsByTeacher } from "@/services/students";

type FilterType = "All" | "Paid" | "Pending" | "JEE" | "NEET";

type SortType =
  | "latest"
  | "name"
  | "rank"
  | "performance"
  | "attendance";

export default function StudentsScreen() {
  const { teacher } = useAuthStore();

  const [students, setStudents] = useState<any[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const [sortType, setSortType] = useState<SortType>("latest");

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

  function isPaid(student: any) {
    return String(student.payment_status || "").toLowerCase() === "paid";
  }

  const paidCount = useMemo(() => {
    return students.filter((student) => isPaid(student)).length;
  }, [students]);

  const pendingCount = useMemo(() => {
    return students.filter((student) => !isPaid(student)).length;
  }, [students]);

  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (activeFilter === "Paid") {
      result = result.filter((student) => isPaid(student));
    }

    if (activeFilter === "Pending") {
      result = result.filter((student) => !isPaid(student));
    }

    if (activeFilter === "JEE") {
      result = result.filter(
        (student) =>
          String(student.batch_category || "").toLowerCase() === "jee",
      );
    }

    if (activeFilter === "NEET") {
      result = result.filter(
        (student) =>
          String(student.batch_category || "").toLowerCase() === "neet",
      );
    }

    if (searchText.trim()) {
      const query = searchText.trim().toLowerCase();

      result = result.filter((student) => {
        const name = String(student.student_name || "").toLowerCase();

        const phone = String(student.phone || "").toLowerCase();

        const className = String(student.class_name || "").toLowerCase();

        const batchName = String(student.batch_name || "").toLowerCase();

        const batchId = String(student.batch_id || "").toLowerCase();

        return (
          name.includes(query) ||
          phone.includes(query) ||
          className.includes(query) ||
          batchName.includes(query) ||
          batchId.includes(query)
        );
      });
    }

    if (sortType === "name") {
      result.sort((a, b) =>
        String(a.student_name || "").localeCompare(
          String(b.student_name || ""),
        ),
      );
    }

    if (sortType === "rank") {
      result.sort((a, b) => (a.rank || 99999) - (b.rank || 99999));
    }

    if (sortType === "performance") {
      result.sort(
        (a, b) => (b.performance_score || 0) - (a.performance_score || 0),
      );
    }

    if (sortType === "attendance") {
      result.sort((a, b) => (b.attendance || 0) - (a.attendance || 0));
    }

    return result;
  }, [students, activeFilter, searchText, sortType]);

  function openSortOptions() {
    Alert.alert("Sort Students", "Choose sorting method", [
      {
        text: "Latest",
        onPress: () => setSortType("latest"),
      },
      {
        text: "Name A-Z",
        onPress: () => setSortType("name"),
      },
      {
        text: "Rank",
        onPress: () => setSortType("rank"),
      },
      {
        text: "Performance",
        onPress: () => setSortType("performance"),
      },
      {
        text: "Attendance",
        onPress: () => setSortType("attendance"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  }

  function openStudentDetails(student: any) {
    router.push({
      pathname: "/teacher/student-details",

      params: {
        id: student.id,

        name: student.student_name,

        className: student.class_name,

        batch: student.batch_name,

        batchId: student.batch_id,

        batchCategory: student.batch_category,

        phone: student.phone,

        parentPhone: student.parent_phone,

        email: student.email,

        performance: student.performance_score,

        attendance: student.attendance,

        tasks: student.tasks_completed,

        rank: student.rank,

        paymentStatus: student.payment_status,

        enrollmentId: student.enrollment_id,
      },
    });
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

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={openSortOptions}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: "#FFF",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
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
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search students..."
                placeholderTextColor="#98A2B3"
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 15,
                  color: "#111827",
                }}
              />

              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: "#6C63FF",
                    }}>
                    Clear
                  </Text>
                </TouchableOpacity>
              )}
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
              gap: 10,
            }}>
            {(["All", "Paid", "Pending", "JEE", "NEET"] as FilterType[]).map(
              (filter) => (
                <FilterPill
                  key={filter}
                  label={filter}
                  active={activeFilter === filter}
                  onPress={() => setActiveFilter(filter)}
                />
              ),
            )}
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
              active={activeFilter === "All"}
              onPress={() => setActiveFilter("All")}
            />

            <StatBox
              title="Paid"
              value={`${paidCount}`}
              color="#10B981"
              bg="#DCFCE7"
              active={activeFilter === "Paid"}
              onPress={() => setActiveFilter("Paid")}
            />

            <StatBox
              title="Pending"
              value={`${pendingCount}`}
              color="#F59E0B"
              bg="#FEF3C7"
              active={activeFilter === "Pending"}
              onPress={() => setActiveFilter("Pending")}
            />
          </View>

          {/* RESULT COUNT */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "800",
                color: "#111827",
              }}>
              {activeFilter} Students
            </Text>

            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: "#667085",
              }}>
              {filteredStudents.length} found
            </Text>
          </View>

          {/* LIST */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 14,
            }}>
            {filteredStudents.length === 0 ? (
              <EmptyState />
            ) : (
              filteredStudents.map((student, index) => (
                <StudentCard
                  key={student.id || index}
                  name={student.student_name}
                  className={student.class_name}
                  batchName={student.batch_name}
                  batchId={student.batch_id}
                  attendance={`${student.attendance || 0}`}
                  tasksCompleted={student.tasks_completed || 0}
                  performanceScore={student.performance_score || 0}
                  rank={student.rank || 0}
                  payment={student.payment_status || "Pending"}
                  paid={isPaid(student)}
                  phone={student.phone}
                  parentPhone={student.parent_phone}
                  onPress={() => openStudentDetails(student)}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          activeOpacity={0.9}
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

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;

  active: boolean;

  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        height: 40,
        paddingHorizontal: 18,
        borderRadius: 20,
        backgroundColor: active ? "#6C63FF" : "#FFF",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: active ? 0 : 1,
        borderColor: "#E5E7EB",
      }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "700",
          color: active ? "#FFF" : "#667085",
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View
      style={{
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 32,
        alignItems: "center",
      }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 20,
          backgroundColor: "#EEE8FF",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 14,
        }}>
        <Users size={28} color="#6C63FF" />
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "800",
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
          lineHeight: 20,
        }}>
        Try changing the search text or filter.
      </Text>
    </View>
  );
}

function StatBox({
  title,
  value,
  color,
  bg,
  active,
  onPress,
}: {
  title: string;

  value: string;

  color: string;

  bg: string;

  active?: boolean;

  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: bg,
        borderRadius: 18,
        paddingVertical: 12,
        alignItems: "center",
        borderWidth: active ? 1.6 : 0,
        borderColor: color,
      }}>
      <Text
        style={{
          fontSize: 12,
          color,
          fontWeight: "700",
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 19,
          fontWeight: "900",
          color: "#111827",
        }}>
        {value}
      </Text>
    </TouchableOpacity>
  );
}