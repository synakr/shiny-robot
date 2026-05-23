import { useEffect, useMemo, useState } from "react";

import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Check } from "lucide-react-native";

import { router } from "expo-router";

import FormInput from "@/components/FormInput";

import { useAuthStore } from "@/store/authStore";

import { createAnnouncement } from "@/services/announcements";

import { getBatchesByTeacher } from "@/services/batches";

export default function CreateAnnouncementScreen() {
  const { teacher } = useAuthStore();

  const [batches, setBatches] = useState<any[]>([]);

  const [title, setTitle] = useState("");

  const [message, setMessage] = useState("");

  const [targetType, setTargetType] = useState("all");

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

  async function handlePublish() {
    if (!title) {
      Alert.alert("Required", "Please enter title.");

      return;
    }

    const response = await createAnnouncement({
      teacherId: teacher?.id || "",

      title,

      message,

      targetType,

      batchId: selectedBatch?.batch_id,

      batchName: selectedBatch?.batch_name,

      batchCategory:
        targetType === "category"
          ? selectedCategory
          : selectedBatch?.batch_category,

      className:
        targetType === "class" ? selectedClass : selectedBatch?.class_name,

      year: selectedBatch?.year,
    });

    if (!response.success) {
      Alert.alert("Error", response.error?.message);

      return;
    }

    Alert.alert("Success", "Announcement published.");

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
                Create Announcement
              </Text>
            </View>
          </View>

          {/* FORM */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 28,
            }}>
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
              }}>
              Send To
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                {
                  label: "All Students",
                  value: "all",
                },

                {
                  label: "Batch",
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

            {/* BATCH TARGET */}
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

            {/* CLASS TARGET */}
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

            {/* CATEGORY TARGET */}
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
            onPress={handlePublish}
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
              Publish Announcement
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
