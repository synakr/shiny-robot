import { useEffect, useMemo, useState } from "react";

import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, CalendarDays, Check, Paperclip } from "lucide-react-native";

import { router, useLocalSearchParams } from "expo-router";

import FormInput from "@/components/FormInput";

import { useAuthStore } from "@/store/authStore";

import { createTask } from "@/services/tasks";

import { getBatchesByTeacher } from "@/services/batches";

export default function CreateTaskScreen() {
  const { teacher } = useAuthStore();

  const params = useLocalSearchParams();

  const [batches, setBatches] = useState<any[]>([]);

  const [title, setTitle] = useState((params.title as string) || "");

  const [description, setDescription] = useState(
    (params.description as string) || "",
  );

  const [dueDate, setDueDate] = useState((params.deadline as string) || "");

  const [totalMarks, setTotalMarks] = useState("");

  const [attachmentUrl, setAttachmentUrl] = useState("");

  const [targetType, setTargetType] = useState("batch");

  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const [selectedClass, setSelectedClass] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function loadBatches() {
      if (!teacher?.id) return;

      const response = await getBatchesByTeacher(teacher.id);

      if (response.success) {
        setBatches(response.data || []);
      }
    }

    loadBatches();
  }, [teacher]);

  const categories = useMemo(() => {
    return [...new Set(batches.map((batch) => batch.batch_category))];
  }, [batches]);

  async function handlePublishTask() {
    if (!title) {
      Alert.alert("Required", "Please enter task title.");

      return;
    }

    const response = await createTask({
      teacherId: teacher?.id || "",

      title,

      description,

      targetType,

      className:
        targetType === "class" ? selectedClass : selectedBatch?.class_name,

      batchId: selectedBatch?.batch_id,

      batchName: selectedBatch?.batch_name,

      batchCategory:
        targetType === "category"
          ? selectedCategory
          : selectedBatch?.batch_category,

      year: selectedBatch?.year,

      totalMarks: Number(totalMarks) || undefined,

      attachmentUrl,

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

            {/* TARGET TYPE */}
            <Text
              style={{
                marginTop: 10,
                marginBottom: 12,
                fontSize: 14,
                fontWeight: "700",
                color: "#111827",
              }}>
              Assign To
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 4,
              }}>
              {[
                {
                  label: "Specific Batch",
                  value: "batch",
                },

                {
                  label: "Class",
                  value: "class",
                },

                {
                  label: "Category",
                  value: "category",
                },

                {
                  label: "All Students",
                  value: "all",
                },
              ].map((item) => {
                const active = targetType === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    activeOpacity={0.9}
                    onPress={() => setTargetType(item.value)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 16,
                      backgroundColor: active ? "#6C63FF" : "#FFF",

                      marginRight: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: active ? "#FFF" : "#111827",
                      }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* BATCH */}
            {targetType === "batch" && (
              <View
                style={{
                  marginTop: 22,
                }}>
                <Text
                  style={{
                    marginBottom: 12,
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#111827",
                  }}>
                  Select Batch
                </Text>

                {batches.map((batch, index) => {
                  const active = selectedBatch?.id === batch.id;

                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.9}
                      onPress={() => setSelectedBatch(batch)}
                      style={{
                        backgroundColor: active ? "#EEE8FF" : "#FFF",

                        borderRadius: 20,

                        padding: 16,

                        marginBottom: 12,

                        borderWidth: active ? 1.5 : 0,

                        borderColor: "#6C63FF",
                      }}>
                      <View
                        style={{
                          flexDirection: "row",

                          justifyContent: "space-between",

                          alignItems: "center",
                        }}>
                        <View
                          style={{
                            flex: 1,
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "800",
                              color: "#111827",
                            }}>
                            {batch.batch_name}
                          </Text>

                          <Text
                            style={{
                              marginTop: 5,
                              fontSize: 12,
                              color: "#667085",
                            }}>
                            {batch.batch_id} • Class {batch.class_name} •{" "}
                            {batch.batch_category}
                          </Text>
                        </View>

                        {active && (
                          <View
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 10,
                              backgroundColor: "#6C63FF",

                              justifyContent: "center",

                              alignItems: "center",
                            }}>
                            <Check size={16} color="#FFF" />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* CLASS */}
            {targetType === "class" && (
              <View
                style={{
                  marginTop: 22,
                }}>
                <Text
                  style={{
                    marginBottom: 12,
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#111827",
                  }}>
                  Select Class
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {["9", "10", "11", "12", "Dropper"].map((item) => {
                    const active = selectedClass === item;

                    return (
                      <TouchableOpacity
                        key={item}
                        activeOpacity={0.9}
                        onPress={() => setSelectedClass(item)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 16,
                          backgroundColor: active ? "#6C63FF" : "#FFF",

                          marginRight: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "700",
                            color: active ? "#FFF" : "#111827",
                          }}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* CATEGORY */}
            {targetType === "category" && (
              <View
                style={{
                  marginTop: 22,
                }}>
                <Text
                  style={{
                    marginBottom: 12,
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#111827",
                  }}>
                  Select Category
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map((item, index) => {
                    const active = selectedCategory === item;

                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.9}
                        onPress={() => setSelectedCategory(item)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 16,
                          backgroundColor: active ? "#6C63FF" : "#FFF",

                          marginRight: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "700",
                            color: active ? "#FFF" : "#111827",
                          }}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* DUE DATE */}
            <View
              style={{
                marginTop: 22,
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

            <FormInput
              label="Total Marks"
              placeholder="Eg. 50"
              value={totalMarks}
              onChangeText={setTotalMarks}
            />

            {/* ATTACHMENT */}
            <View
              style={{
                marginTop: 6,
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

        {/* BUTTON */}
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
