import { useState } from "react";

import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, CalendarDays, Paperclip } from "lucide-react-native";

import { router, useLocalSearchParams } from "expo-router";

import FormInput from "@/components/FormInput";

import SelectBox from "@/components/SelectBox";

import { useAuthStore } from "@/store/authStore";

import { createTask } from "@/services/tasks";

export default function CreateTaskScreen() {
  const { teacher } = useAuthStore();

  const params = useLocalSearchParams();

  const [title, setTitle] = useState((params.title as string) || "");

  const [description, setDescription] = useState(
    (params.description as string) || "",
  );

  const [className, setClassName] = useState("");

  const [batchName, setBatchName] = useState((params.batch as string) || "");

  const [dueDate, setDueDate] = useState((params.deadline as string) || "");

  async function handlePublishTask() {
    if (!title) {
      Alert.alert("Required", "Please enter task title.");

      return;
    }

    const response = await createTask({
      teacherId: teacher?.id || "",

      title,

      description,

      className,

      batchName,

      dueDate,
    });

    if (!response.success) {
      Alert.alert("Error", response.error?.message);

      return;
    }

    Alert.alert("Success", "Task published successfully.");

    router.back();
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
                    fontSize: 26,
                    fontWeight: "800",
                    color: "#111827",
                  }}>
                  Create Task
                </Text>
              </View>

              <TouchableOpacity>
                <Text
                  style={{
                    color: "#6C63FF",
                    fontSize: 15,
                    fontWeight: "700",
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FORM */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 28,
            }}>
            <FormInput
              label="Task Title"
              placeholder="Enter task title"
              value={title}
              onChangeText={setTitle}
            />

            <FormInput
              label="Description"
              placeholder="Write task details..."
              multiline
              value={description}
              onChangeText={setDescription}
            />

            <FormInput
              label="Class"
              placeholder="Enter class"
              value={className}
              onChangeText={setClassName}
            />

            <FormInput
              label="Batch"
              placeholder="Enter batch"
              value={batchName}
              onChangeText={setBatchName}
            />

            <SelectBox label="Subject" value="Mathematics" />

            {/* DUE DATE */}
            <View
              style={{
                marginBottom: 18,
              }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#111827",
                }}>
                Due Date
              </Text>

              <TouchableOpacity
                style={{
                  height: 54,
                  borderRadius: 18,
                  backgroundColor: "#FFF",
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  shadowColor: "#000",
                  shadowOpacity: 0.02,
                  shadowRadius: 4,
                  elevation: 1,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#111827",
                  }}>
                  {dueDate || "Select Due Date"}
                </Text>

                <CalendarDays size={20} color="#667085" />
              </TouchableOpacity>
            </View>

            {/* QUESTIONS */}
            <FormInput
              label="Questions / Marks"
              placeholder="Eg. 20 Questions • 50 Marks"
            />

            {/* ATTACHMENT */}
            <View
              style={{
                marginBottom: 18,
              }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#111827",
                }}>
                Attachment
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  height: 110,
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderStyle: "dashed",
                  borderColor: "#D0D5DD",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FFF",
                }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: "#EEE8FF",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}>
                  <Paperclip size={20} color="#6C63FF" />
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#111827",
                  }}>
                  Upload PDF / Image
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: "#98A2B3",
                  }}>
                  Coming Soon
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* PUBLISH BUTTON */}
        <View
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 24,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePublishTask}
            style={{
              height: 56,
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
              Publish Task
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
