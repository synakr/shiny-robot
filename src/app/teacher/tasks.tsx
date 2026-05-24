import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useEffect, useMemo, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  ClipboardList,
  Layers3,
  Plus,
  Users,
} from "lucide-react-native";

import { router } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { getTasksByTeacher } from "@/services/tasks";

export default function TasksScreen() {
  const { teacher } = useAuthStore();

  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    async function loadTasks() {
      if (!teacher?.id) return;

      const response = await getTasksByTeacher(teacher.id);

      if (response.success) {
        setTasks(response.data || []);
      }
    }

    loadTasks();
  }, [teacher]);

  const activeTasks = useMemo(() => {
    return tasks.filter((task) => task.status !== "completed").length;
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks.filter((task) => task.status === "completed").length;
  }, [tasks]);

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
                  Tasks
                </Text>
              </View>
            </View>
          </View>

          {/* STATS */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              marginTop: 22,
              gap: 12,
            }}>
            <StatCard
              title="Total"
              value={`${tasks.length}`}
              bg="#EEE8FF"
              color="#6C63FF"
            />

            <StatCard
              title="Completed"
              value={`${completedTasks}`}
              bg="#DCFCE7"
              color="#10B981"
            />

            <StatCard
              title="Active"
              value={`${activeTasks}`}
              bg="#FEF3C7"
              color="#F59E0B"
            />
          </View>

          {/* TASK LIST */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 24,
            }}>
            {tasks.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 24,
                  padding: 30,
                  alignItems: "center",
                }}>
                <ClipboardList size={42} color="#98A2B3" />

                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#111827",
                  }}>
                  No Tasks Yet
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "#667085",
                    textAlign: "center",
                  }}>
                  Create your first task for students
                </Text>
              </View>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={index}
                  title={task.title}
                  description={task.description}
                  targetType={task.target_type}
                  batchName={task.batch_name}
                  batchCategory={task.batch_category}
                  className={task.class_name}
                  dueDate={task.due_date}
                  totalMarks={task.total_marks}
                  status={task.status}
                  onPress={() =>
                    router.push({
                      pathname: "/teacher/create-task",

                      params: {
                        title: task.title,

                        description: task.description,

                        batch: task.batch_name,

                        deadline: task.due_date,
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
          activeOpacity={0.9}
          onPress={() => router.push("/teacher/create-task")}
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

function TaskCard({
  title,
  description,
  targetType,
  batchName,
  batchCategory,
  className,
  dueDate,
  totalMarks,
  status,
  onPress,
}: {
  title: string;

  description?: string;

  targetType: string;

  batchName?: string;

  batchCategory?: string;

  className?: string;

  dueDate?: string;

  totalMarks?: number;

  status?: string;

  onPress?: () => void;
}) {
  function getTargetLabel() {
    if (targetType === "all") {
      return "All Students";
    }

    if (targetType === "batch") {
      return batchName;
    }

    if (targetType === "category") {
      return batchCategory;
    }

    if (targetType === "class") {
      return `Class ${className}`;
    }

    return "Students";
  }

  const completed = status === "completed";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 22,
        padding: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      <View
        style={{
          flexDirection: "row",
        }}>
        {/* ICON */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 16,
            backgroundColor: "#EEE8FF",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}>
          <ClipboardList size={20} color="#6C63FF" />
        </View>

        {/* CONTENT */}
        <View style={{ flex: 1 }}>
          {/* TOP */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: 15,
                fontWeight: "800",
                color: "#111827",
                paddingRight: 10,
              }}>
              {title}
            </Text>

            <View
              style={{
                backgroundColor: completed ? "#DCFCE7" : "#FEF3C7",

                paddingHorizontal: 10,

                paddingVertical: 5,

                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: completed ? "#10B981" : "#D97706",
                }}>
                {completed ? "Completed" : "Active"}
              </Text>
            </View>
          </View>

          {/* TARGET */}
          <View
            style={{
              marginTop: 8,
              alignSelf: "flex-start",
              backgroundColor: "#F3F4F6",

              paddingHorizontal: 10,

              paddingVertical: 5,

              borderRadius: 10,

              flexDirection: "row",

              alignItems: "center",
            }}>
            {targetType === "batch" ? (
              <Layers3 size={11} color="#4B5563" />
            ) : (
              <Users size={11} color="#4B5563" />
            )}

            <Text
              style={{
                marginLeft: 5,
                fontSize: 11,
                fontWeight: "700",
                color: "#4B5563",
              }}>
              {getTargetLabel()}
            </Text>
          </View>

          {/* DESCRIPTION */}
          {!!description && (
            <Text
              numberOfLines={2}
              style={{
                marginTop: 10,
                fontSize: 13,
                lineHeight: 20,
                color: "#667085",
              }}>
              {description}
            </Text>
          )}

          {/* FOOTER */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
              gap: 18,
            }}>
            {!!dueDate && (
              <FooterText label="Due" value={formatDate(dueDate)} />
            )}

            {!!totalMarks && (
              <FooterText label="Marks" value={`${totalMarks}`} />
            )}

            <FooterText label="Progress" value="75%" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterText({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <View>
      <Text
        style={{
          fontSize: 11,
          color: "#98A2B3",
        }}>
        {label}
      </Text>

      <Text
        style={{
          marginTop: 2,
          fontSize: 13,
          fontWeight: "700",
          color: "#111827",
        }}>
        {value}
      </Text>
    </View>
  );
}

function StatCard({
  title,
  value,
  bg,
  color,
}: {
  title: string;

  value: string;

  bg: string;

  color: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg,
        borderRadius: 18,
        paddingVertical: 12,
        alignItems: "center",
      }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color,
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

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
