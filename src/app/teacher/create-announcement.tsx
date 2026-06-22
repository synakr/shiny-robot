import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  Check,
  Circle,
} from "lucide-react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import FormInput from "@/components/FormInput";
import { useAuthStore } from "@/store/authStore";
import { createAnnouncement } from "@/services/announcements";
import { getBatchesByTeacher } from "@/services/batches";

type TargetType = "all" | "batch" | "class" | "category";

export default function CreateAnnouncementScreen() {
  const { teacher } = useAuthStore();

  const params = useLocalSearchParams<{
    batchId?: string;
    batchName?: string;
  }>();

  const batchIdParam = Array.isArray(params.batchId)
    ? params.batchId[0]
    : params.batchId;

  const batchNameParam = Array.isArray(params.batchName)
    ? params.batchName[0]
    : params.batchName;

  const [batches, setBatches] = useState<any[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState<TargetType>(
    batchIdParam ? "batch" : "all"
  );

  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
              return batch.batch_id === batchIdParam || batch.id === batchIdParam;
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

  async function handlePublish() {
    try {
      if (!title.trim()) {
        Alert.alert("Required", "Please enter title.");
        return;
      }

      if (!teacher?.id) {
        Alert.alert("Error", "Teacher not found.");
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

      const response = await createAnnouncement({
        teacherId: teacher.id,
        title: title.trim(),
        message: message.trim(),
        targetType,
        batchId:
          targetType === "batch"
            ? (selectedBatch?.batch_id || selectedBatch?.id || null)
            : null,
        batchName:
          targetType === "batch"
            ? selectedBatch?.batch_name || batchNameParam || null
            : null,
        batchCategory:
          targetType === "category"
            ? selectedCategory
            : selectedBatch?.batch_category || null,
        className:
          targetType === "class"
            ? selectedClass
            : selectedBatch?.class_name || null,
        year: targetType === "batch" ? selectedBatch?.year : null,
      });

      if (!response.success) {
        Alert.alert("Error", response.error?.message || "Could not publish announcement.");
        return;
      }

      Alert.alert("Success", "Announcement published.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.log("publish announcement error:", error);
      Alert.alert(
        "Error",
        error?.message || "Something went wrong while publishing announcement."
      );
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
              }}
            >
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color="#111827" />
              </TouchableOpacity>

              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "800",
                    color: "#111827",
                  }}
                >
                  Create Announcement
                </Text>

                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 13,
                    color: "#667085",
                  }}
                >
                  Share updates with all students or a specific audience
                </Text>
              </View>
            </View>
          </View>

          {/* FORM */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 28,
            }}
          >
            <FormInput
              label="Title"
              placeholder="Enter announcement title"
              value={title}
              onChangeText={setTitle}
            />

            <FormInput
              label="Message"
              placeholder="Write announcement..."
              multiline
              value={message}
              onChangeText={setMessage}
            />

            {/* TARGET TYPE */}
            <Text
              style={{
                marginTop: 12,
                marginBottom: 12,
                fontSize: 14,
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Send To
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { label: "All Students", value: "all" as TargetType },
                { label: "Batch", value: "batch" as TargetType },
                { label: "Class", value: "class" as TargetType },
                { label: "Category", value: "category" as TargetType },
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

            {/* BATCH TARGET */}
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

            {/* CLASS TARGET */}
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

            {/* CATEGORY TARGET */}
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
            onPress={handlePublish}
            style={{
              height: 56,
              borderRadius: 18,
              backgroundColor: "#4F46E5",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Publish Announcement
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}