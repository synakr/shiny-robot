import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect, useMemo, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  ClipboardList,
  SlidersHorizontal,
} from "lucide-react-native";

import { router } from "expo-router";

import TaskCard from "@/components/TaskCard";

import { useAuthStore } from "@/store/authStore";

import { getTasksForStudent } from "@/services/student-tasks";

export default function TasksScreen() {
  const { student } = useAuthStore();

  const [tasks, setTasks] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function loadTasks() {
      if (!student) return;

      setLoading(true);

      const response = await getTasksForStudent(student);

      if (response.success) {
        setTasks(response.data || []);
      }

      setLoading(false);
    }

    loadTasks();
  }, [student]);

  const pendingTasks = useMemo(() => {
    return tasks.filter((task) => task.status === "active");
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks.filter((task) => task.status === "completed");
  }, [tasks]);

  const filteredTasks =
    activeFilter === "Pending"
      ? pendingTasks
      : activeFilter === "Completed"
        ? completedTasks
        : tasks;

  function formatDueDate(dateString?: string) {
    if (!dateString) return "No Deadline";

    const date = new Date(dateString);

    return `Due: ${date.toLocaleDateString()}`;
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
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={28} color="#111827" />
              </TouchableOpacity>

              <Text
                style={{
                  marginLeft: 14,
                  fontSize: 30,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Tasks / DPP
              </Text>
            </View>

            <TouchableOpacity>
              <SlidersHorizontal size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        {/* FILTER PILLS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            marginTop: 22,
            paddingBottom: 4,
            gap: 10,
          }}>
          <FilterPill
            label={`All (${tasks.length})`}
            active={activeFilter === "All"}
            onPress={() => setActiveFilter("All")}
          />

          <FilterPill
            label={`Pending (${pendingTasks.length})`}
            active={activeFilter === "Pending"}
            onPress={() => setActiveFilter("Pending")}
          />

          <FilterPill
            label={`Completed (${completedTasks.length})`}
            active={activeFilter === "Completed"}
            onPress={() => setActiveFilter("Completed")}
          />
        </ScrollView>

        {/* LOADING */}
        {loading ? (
          <View
            style={{
              marginTop: 80,
              alignItems: "center",
            }}>
            <ActivityIndicator size="large" color="#6C63FF" />
          </View>
        ) : filteredTasks.length === 0 ? (
          <View
            style={{
              marginTop: 60,
              marginHorizontal: 20,
              backgroundColor: "#FFF",
              borderRadius: 26,
              padding: 34,
              alignItems: "center",
            }}>
            <ClipboardList size={44} color="#98A2B3" />

            <Text
              style={{
                marginTop: 16,
                fontSize: 18,
                fontWeight: "800",
                color: "#111827",
              }}>
              No Tasks Found
            </Text>

            <Text
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "#667085",
                textAlign: "center",
                lineHeight: 20,
              }}>
              Tasks assigned by your teacher will appear here.
            </Text>
          </View>
        ) : (
          <>
            <SectionTitle
              title={
                activeFilter === "Completed"
                  ? "Completed Tasks"
                  : activeFilter === "Pending"
                    ? "Pending Tasks"
                    : "All Tasks"
              }
            />

            <View
              style={{
                paddingHorizontal: 20,
              }}>
              {filteredTasks.map((task, index) => (
                <TaskCard
                  key={index}
                  title={task.title}
                  questions={
                    task.total_marks
                      ? `${task.total_marks} Marks`
                      : "Practice Task"
                  }
                  due={formatDueDate(task.due_date)}
                  status={task.status === "completed" ? "Completed" : "Pending"}
                  statusColor={
                    task.status === "completed" ? "#10B981" : "#D97706"
                  }
                  statusBg={task.status === "completed" ? "#DCFCE7" : "#FEF3C7"}
                  completed={task.status === "completed"}
                  onPress={() =>
                    router.push({
                      pathname: "/task-details",

                      params: {
                        title: task.title,

                        description: task.description,

                        dueDate: task.due_date,

                        marks: task.total_marks,

                        batch: task.batch_name,

                        attachment: task.attachment_url,

                        status: task.status,
                      },
                    })
                  }
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text
      style={{
        paddingHorizontal: 20,
        marginTop: 26,
        marginBottom: 8,
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
      }}>
      {title}
    </Text>
  );
}

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;

  active?: boolean;

  onPress?: () => void;
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
