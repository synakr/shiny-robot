import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, ClipboardList, Plus } from "lucide-react-native";

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
              value="12"
              bg="#DCFCE7"
              color="#10B981"
            />

            <StatCard title="Pending" value="4" bg="#FEF3C7" color="#F59E0B" />
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
                  batch={`${task.class_name} • ${task.batch_name}`}
                  deadline={task.due_date || "No Deadline"}
                  submissions="18/24"
                  completed={index % 2 === 0}
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
  batch,
  deadline,
  submissions,
  completed,
  onPress,
}: {
  title: string;

  description: string;

  batch: string;

  deadline: string;

  submissions: string;

  completed: boolean;

  onPress?: () => void;
}) {
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
      {/* TOP */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <View style={{ flex: 1 }}>
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
              marginTop: 6,
              fontSize: 13,
              color: "#667085",
            }}>
            {batch}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: completed ? "#DCFCE7" : "#FEF3C7",

            paddingHorizontal: 12,

            paddingVertical: 6,

            borderRadius: 12,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: completed ? "#10B981" : "#D97706",
            }}>
            {completed ? "Completed" : "Pending"}
          </Text>
        </View>
      </View>

      {/* DESCRIPTION */}
      <Text
        style={{
          marginTop: 14,
          fontSize: 14,
          lineHeight: 22,
          color: "#667085",
        }}>
        {description}
      </Text>

      {/* STATS */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 18,
        }}>
        <InfoBox title="Deadline" value={deadline} />

        <InfoBox title="Submissions" value={submissions} />

        <InfoBox title="Progress" value="75%" />
      </View>
    </TouchableOpacity>
  );
}

function InfoBox({
  title,
  value,
}: {
  title: string;

  value: string;
}) {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Text
        style={{
          fontSize: 12,
          color: "#98A2B3",
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 15,
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
