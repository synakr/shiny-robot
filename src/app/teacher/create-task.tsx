import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  Paperclip,
  X,
  FileText,
} from "lucide-react-native";

import { router, useLocalSearchParams } from "expo-router";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";

import FormInput from "@/components/FormInput";
import { useAuthStore } from "@/store/authStore";
import { createTask } from "@/services/tasks";
import { getBatchesByTeacher } from "@/services/batches";
import { supabase } from "@/lib/supabase";

type TargetType = "batch" | "class" | "category" | "all";
type AttachmentKind = "pdf" | "image" | "docx";

function formatDateForDisplay(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isValidISODate(value: string) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export default function CreateTaskScreen() {
  const { teacher } = useAuthStore();
  const params = useLocalSearchParams<{
    batchId?: string;
    batchName?: string;
    title?: string;
    description?: string;
    deadline?: string;
  }>();

  const batchIdParam = Array.isArray(params.batchId)
    ? params.batchId[0]
    : params.batchId;

  const batchNameParam = Array.isArray(params.batchName)
    ? params.batchName[0]
    : params.batchName;

  const [batches, setBatches] = useState<any[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);

  const [title, setTitle] = useState((params.title as string) || "");
  const [description, setDescription] = useState(
    (params.description as string) || "",
  );

  const [dueDate, setDueDate] = useState((params.deadline as string) || "");
  const [dueDateDraft, setDueDateDraft] = useState((params.deadline as string) || "");
  const [dueDateModalVisible, setDueDateModalVisible] = useState(false);

  const [totalMarks, setTotalMarks] = useState("");

  const [targetType, setTargetType] = useState<TargetType>(
    batchIdParam ? "batch" : "all",
  );

  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentUri, setAttachmentUri] = useState("");
  const [attachmentKind, setAttachmentKind] = useState<AttachmentKind | "">("");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadBatches() {
      if (!teacher?.id) return;

      setLoadingBatches(true);

      try {
        const response = await getBatchesByTeacher(teacher.id);

        if (response.success) {
          const loadedBatches = response.data || [];
          setBatches(loadedBatches);

          if (batchIdParam) {
            const foundBatch = loadedBatches.find((batch: any) => {
              return (
                batch.batch_id === batchIdParam ||
                batch.id === batchIdParam
              );
            });

            if (foundBatch) {
              setTargetType("batch");
              setSelectedBatch(foundBatch);
            }
          }
        } else {
          setBatches([]);
        }
      } catch (error) {
        console.log("loadBatches error:", error);
      } finally {
        setLoadingBatches(false);
      }
    }

    loadBatches();
  }, [teacher?.id, batchIdParam]);

  const categories = useMemo(() => {
    return [...new Set(batches.map((batch) => batch.batch_category).filter(Boolean))];
  }, [batches]);

  const classOptions = useMemo(() => ["9", "10", "11", "12", "Dropper"], []);

  function resetBatchSelection() {
    setSelectedBatch(null);
  }

  function openDueDateModal() {
    setDueDateDraft(dueDate || toISODate(new Date()));
    setDueDateModalVisible(true);
  }

  function applyDueDateShortcut(daysToAdd: number) {
    const date = daysToAdd === 0 ? new Date() : addDays(daysToAdd);
    setDueDateDraft(toISODate(date));
  }

  function confirmDueDate() {
    const trimmed = dueDateDraft.trim();

    if (!trimmed) {
      setDueDate("");
      setDueDateModalVisible(false);
      return;
    }

    if (!isValidISODate(trimmed)) {
      Alert.alert("Invalid Date", "Please enter a valid date in YYYY-MM-DD format.");
      return;
    }

    setDueDate(trimmed);
    setDueDateModalVisible(false);
  }

  async function handlePickAttachment() {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "image/*",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets?.[0];
    if (!file) return;

    const fileName = file.name || "attachment";
    const lower = fileName.toLowerCase();
    const mimeType = file.mimeType || "";

    if (lower.endsWith(".pdf") || mimeType.includes("pdf")) {
      setAttachmentKind("pdf");
    } else if (
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".png") ||
      mimeType.startsWith("image/")
    ) {
      setAttachmentKind("image");
    } else if (lower.endsWith(".docx") || mimeType.includes("wordprocessingml")) {
      setAttachmentKind("docx");
    } else {
      setAttachmentKind("pdf");
    }

    setAttachmentName(fileName);
    setAttachmentUri(file.uri);

    Alert.alert("Attachment Selected", fileName);
  }

  async function uploadAttachmentToStorage() {
    if (!attachmentUri || !attachmentName) return "";

    const base64 = await FileSystem.readAsStringAsync(attachmentUri, {
      encoding: "base64" as any,
    });

    const safeName = attachmentName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `tasks/${Date.now()}-${safeName}`;

    const uploadResponse = await supabase.storage
      .from("notes")
      .upload(filePath, decode(base64), {
        contentType: "application/octet-stream",
        upsert: false,
      });

    if (uploadResponse.error) {
      throw uploadResponse.error;
    }

    const { data } = supabase.storage.from("notes").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handlePublishTask() {
    try {
      if (!title.trim()) {
        Alert.alert("Required", "Please enter task title.");
        return;
      }

      if (targetType === "batch" && !selectedBatch) {
        Alert.alert("Required", "Please select a batch.");
        return;
      }

      if (targetType === "class" && !selectedClass) {
        Alert.alert("Required", "Please select a class.");
        return;
      }

      if (targetType === "category" && !selectedCategory) {
        Alert.alert("Required", "Please select a category.");
        return;
      }

      if (dueDate && !isValidISODate(dueDate)) {
        Alert.alert("Invalid Date", "Please enter a valid due date in YYYY-MM-DD format.");
        return;
      }

      if (!teacher?.id) {
        Alert.alert("Error", "Teacher not found.");
        return;
      }

      setUploading(true);

      let attachmentUrl = "";

      if (attachmentUri && attachmentName) {
        attachmentUrl = await uploadAttachmentToStorage();
      }

      const response = await createTask({
        teacherId: teacher.id,
        title: title.trim(),
        description: description.trim(),
        targetType,
        className:
          targetType === "class"
            ? selectedClass
            : selectedBatch?.class_name,
        batchId:
          targetType === "batch"
            ? (selectedBatch?.batch_id || selectedBatch?.id || null)
            : null,
        batchName:
          targetType === "batch"
            ? selectedBatch?.batch_name
            : null,
        batchCategory:
          targetType === "category"
            ? selectedCategory
            : selectedBatch?.batch_category,
        year: selectedBatch?.year,
        totalMarks: Number(totalMarks) || undefined,
        attachmentUrl,
        dueDate: dueDate || undefined,
      });

      if (!response.success) {
        Alert.alert("Error", response.error?.message || "Could not publish task.");
        return;
      }

      Alert.alert("Success", "Task published successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.log("publish task error:", error);
      Alert.alert(
        "Upload Failed",
        error?.message || "Unknown error while publishing task",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 140,
          }}
        >
          {/* HEADER */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => router.back()}>
                  <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>

                <View style={{ marginLeft: 14 }}>
                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: "800",
                      color: "#111827",
                    }}
                  >
                    Create Task
                  </Text>

                  <Text
                    style={{
                      marginTop: 3,
                      fontSize: 13,
                      color: "#667085",
                    }}
                  >
                    Share DPPs, homework, and assignments
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* FORM */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 24,
            }}
          >
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
              }}
            >
              Assign To
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 4,
              }}
            >
              {[
                { label: "Specific Batch", value: "batch" as TargetType },
                { label: "Class", value: "class" as TargetType },
                { label: "Category", value: "category" as TargetType },
                { label: "All Students", value: "all" as TargetType },
              ].map((item) => {
                const active = targetType === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    activeOpacity={0.9}
                    onPress={() => {
                      setTargetType(item.value);

                      if (item.value !== "batch") {
                        resetBatchSelection();
                      }

                      if (item.value !== "class") {
                        setSelectedClass("");
                      }

                      if (item.value !== "category") {
                        setSelectedCategory("");
                      }
                    }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 16,
                      backgroundColor: active ? "#4F46E5" : "#FFF",
                      marginRight: 10,
                      borderWidth: 1,
                      borderColor: active ? "#4F46E5" : "#E5E7EB",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: active ? "#FFF" : "#111827",
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* BATCH */}
            {targetType === "batch" && (
              <View style={{ marginTop: 22 }}>
                <Text
                  style={{
                    marginBottom: 12,
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  Select Batch
                </Text>

                {loadingBatches ? (
                  <View
                    style={{
                      paddingVertical: 20,
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator size="small" color="#4F46E5" />
                    <Text
                      style={{
                        marginTop: 8,
                        fontSize: 13,
                        color: "#667085",
                      }}
                    >
                      Loading batches...
                    </Text>
                  </View>
                ) : batches.length === 0 ? (
                  <View
                    style={{
                      backgroundColor: "#FFF",
                      borderRadius: 20,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                    }}
                  >
                    <Text
                      style={{
                        color: "#667085",
                        textAlign: "center",
                      }}
                    >
                      No batches found.
                    </Text>
                  </View>
                ) : (
                  <View>
                    {batches.map((batch, index) => {
                      const active =
                        selectedBatch?.id === batch.id ||
                        selectedBatch?.batch_id === batch.batch_id;

                      return (
                        <TouchableOpacity
                          key={batch.id || batch.batch_id || index}
                          activeOpacity={0.9}
                          onPress={() => setSelectedBatch(batch)}
                          style={{
                            backgroundColor: active ? "#EEF2FF" : "#FFF",
                            borderRadius: 20,
                            padding: 16,
                            marginBottom: 12,
                            borderWidth: active ? 1.5 : 1,
                            borderColor: active ? "#4F46E5" : "#E5E7EB",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <View style={{ flex: 1, paddingRight: 12 }}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: "800",
                                  color: "#111827",
                                }}
                              >
                                {batch.batch_name}
                              </Text>

                              <Text
                                style={{
                                  marginTop: 5,
                                  fontSize: 12,
                                  color: "#667085",
                                }}
                              >
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
                                  backgroundColor: "#4F46E5",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Check size={16} color="#FFF" />
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            {/* CLASS */}
            {targetType === "class" && (
              <View style={{ marginTop: 22 }}>
                <Text
                  style={{
                    marginBottom: 12,
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  Select Class
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {classOptions.map((item) => {
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
                          backgroundColor: active ? "#4F46E5" : "#FFF",
                          marginRight: 10,
                          borderWidth: 1,
                          borderColor: active ? "#4F46E5" : "#E5E7EB",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "700",
                            color: active ? "#FFF" : "#111827",
                          }}
                        >
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
              <View style={{ marginTop: 22 }}>
                <Text
                  style={{
                    marginBottom: 12,
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  Select Category
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.length > 0 ? (
                    categories.map((item, index) => {
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
                            backgroundColor: active ? "#4F46E5" : "#FFF",
                            marginRight: 10,
                            borderWidth: 1,
                            borderColor: active ? "#4F46E5" : "#E5E7EB",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: "700",
                              color: active ? "#FFF" : "#111827",
                            }}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <View
                      style={{
                        backgroundColor: "#FFF",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                      }}
                    >
                      <Text style={{ color: "#667085" }}>
                        No categories found.
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}

            {/* DUE DATE */}
            <View style={{ marginTop: 22, marginBottom: 18 }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                Due Date
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={openDueDateModal}
                style={{
                  height: 56,
                  borderRadius: 18,
                  backgroundColor: "#FFF",
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: dueDate ? "#111827" : "#98A2B3",
                    fontWeight: dueDate ? "600" : "500",
                  }}
                >
                  {dueDate ? formatDateForDisplay(new Date(dueDate)) : "Select Due Date"}
                </Text>

                <CalendarDays size={20} color="#667085" />
              </TouchableOpacity>
            </View>

            <FormInput
              label="Total Marks"
              placeholder="Eg. 50"
              value={totalMarks}
              onChangeText={setTotalMarks}
              keyboardType="numeric"
            />

            {/* ATTACHMENT */}
            <View style={{ marginTop: 6, marginBottom: 18 }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                Attachment
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handlePickAttachment}
                style={{
                  minHeight: 118,
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderStyle: "dashed",
                  borderColor: "#D0D5DD",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FFF",
                  paddingVertical: 18,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: "#EEF2FF",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Paperclip size={20} color="#4F46E5" />
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {attachmentName ? "Change Attachment" : "Upload PDF / Image / DOCX"}
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: "#98A2B3",
                    textAlign: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  {attachmentName
                    ? attachmentName
                    : "Tap to select a file attachment for this task"}
                </Text>
              </TouchableOpacity>

              {!!attachmentName && (
                <View
                  style={{
                    marginTop: 14,
                    backgroundColor: "#ECFDF5",
                    borderRadius: 16,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: "#BBF7D0",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: "#059669",
                    }}
                  >
                    Attachment Ready
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={{
                      marginTop: 4,
                      color: "#111827",
                      fontWeight: "600",
                    }}
                  >
                    {attachmentName}
                  </Text>
                </View>
              )}
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
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={uploading}
            onPress={handlePublishTask}
            style={{
              height: 56,
              borderRadius: 18,
              backgroundColor: uploading ? "#A5B4FC" : "#4F46E5",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            {uploading ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ActivityIndicator size="small" color="#FFF" />
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 16,
                    fontWeight: "700",
                    marginLeft: 10,
                  }}
                >
                  Publishing...
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Publish Task
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* DUE DATE MODAL */}
      <Modal
        visible={dueDateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDueDateModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 24,
              padding: 18,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                Set Due Date
              </Text>

              <TouchableOpacity onPress={() => setDueDateModalVisible(false)}>
                <X size={22} color="#111827" />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 13,
                color: "#667085",
                marginBottom: 14,
                lineHeight: 18,
              }}
            >
              Use the quick options or enter a date in <Text style={{ fontWeight: "700" }}>YYYY-MM-DD</Text> format.
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {[
                { label: "Today", days: 0 },
                { label: "Tomorrow", days: 1 },
                { label: "In 3 Days", days: 3 },
                { label: "In 7 Days", days: 7 },
              ].map((item) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => applyDueDateShortcut(item.days)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 14,
                    backgroundColor: "#EEF2FF",
                  }}
                >
                  <Text
                    style={{
                      color: "#4F46E5",
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              value={dueDateDraft}
              onChangeText={setDueDateDraft}
              placeholder="YYYY-MM-DD"
              style={{
                height: 54,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                paddingHorizontal: 16,
                backgroundColor: "#FFF",
                fontSize: 15,
                color: "#111827",
              }}
            />

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setDueDate("");
                  setDueDateDraft("");
                  setDueDateModalVisible(false);
                }}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: "#F3F4F6",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#111827",
                    fontWeight: "700",
                  }}
                >
                  Clear
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmDueDate}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: "#4F46E5",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFF",
                    fontWeight: "700",
                  }}
                >
                  Set Date
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}