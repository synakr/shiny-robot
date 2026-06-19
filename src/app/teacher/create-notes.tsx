import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { getBatchesByTeacher } from "@/services/batches";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as DocumentPicker from "expo-document-picker";

import {
  Alert,
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { FileText, CheckCircle2 } from "lucide-react-native";

import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

type TargetType = "all" | "batch";
type NoteType = "pdf" | "image" | "docx" | "text";

export default function CreateNoteScreen() {
  const params = useLocalSearchParams<{
    batchId?: string;
    batchName?: string;
  }>();

  const batchIdParam = Array.isArray(params.batchId)
    ? params.batchId[0]
    : params.batchId;

  const [typedNote, setTypedNote] = useState("");
  const [inputMode, setInputMode] = useState<"file" | "text">("file");
  const [noteType, setNoteType] = useState<NoteType>("pdf");
  const { teacher } = useAuthStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUri, setFileUri] = useState("");
  const [uploading, setUploading] = useState(false);

  const [targetType, setTargetType] = useState<TargetType>("all");
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [loadingBatches, setLoadingBatches] = useState(false);

  async function handlePickFile() {
    setInputMode("file");

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

    const name = file.name.toLowerCase();
    const mimeType = file.mimeType || "";

    if (name.endsWith(".pdf") || mimeType.includes("pdf")) {
      setNoteType("pdf");
    } else if (
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg") ||
      name.endsWith(".png") ||
      mimeType.startsWith("image/")
    ) {
      setNoteType("image");
    } else if (
      name.endsWith(".docx") ||
      mimeType.includes("wordprocessingml")
    ) {
      setNoteType("docx");
    } else {
      setNoteType("pdf");
    }

    setFileName(file.name);
    setFileUri(file.uri);

    Alert.alert("File Selected", file.name);
  }

  async function handleUploadNote() {
    try {
      if (!title.trim()) {
        Alert.alert("Required", "Please enter title.");
        return;
      }

      if (targetType === "batch" && !selectedBatch) {
        Alert.alert("Required", "Please select a batch.");
        return;
      }

      if (!teacher?.id) {
        Alert.alert("Error", "Teacher not found.");
        return;
      }

      setUploading(true);

      const batchFields =
        targetType === "batch"
          ? {
              batch_id: selectedBatch?.batch_id ?? null,
              batch_name: selectedBatch?.batch_name ?? null,
              batch_category: selectedBatch?.batch_category ?? null,
              class_name: selectedBatch?.class_name ?? null,
              year: selectedBatch?.year ?? null,
            }
          : {
              batch_id: null,
              batch_name: null,
              batch_category: null,
              class_name: null,
              year: null,
            };

      // TEXT NOTE
      if (inputMode === "text") {
        if (!typedNote.trim()) {
          Alert.alert("Required", "Please enter note content.");
          return;
        }

        const noteResponse = await supabase.from("notes").insert({
          teacher_id: teacher.id,
          titile: title,
          description,
          note_type: "text",
          note_content: typedNote,
          target_type: targetType,
          ...batchFields,
        });

        if (noteResponse.error) {
          Alert.alert("Database Error", noteResponse.error.message);
          return;
        }

        Alert.alert("Success", "Text note saved successfully.", [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]);

        setTitle("");
        setDescription("");
        setTypedNote("");
        return;
      }

      // FILE NOTE
      if (!fileUri || !fileName) {
        Alert.alert("Required", "Please select a file.");
        return;
      }

      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: "base64" as any,
      });

      const filePath = `${Date.now()}-${fileName}`;

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

      const noteResponse = await supabase.from("notes").insert({
        teacher_id: teacher.id,
        titile: title,
        description,
        file_name: fileName,
        file_url: data.publicUrl,
        note_type: noteType,
        target_type: targetType,
        ...batchFields,
      });

      if (noteResponse.error) {
        Alert.alert("Database Error", noteResponse.error.message);
        return;
      }

      Alert.alert("Success", "Note uploaded successfully.", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);

      setTitle("");
      setDescription("");
      setFileName("");
      setFileUri("");
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Upload Failed",
        error?.message || "Unknown error"
      );
    } finally {
      setUploading(false);
    }
  }

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
            const foundBatch = loadedBatches.find(
              (batch: any) =>
                batch.batch_id === batchIdParam || batch.id === batchIdParam
            );

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 140,
        }}
      >
        <View
          style={{
            backgroundColor: "#FFF",
            borderRadius: 28,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "800",
              color: "#111827",
            }}
          >
            Share Notes
          </Text>

          <Text
            style={{
              marginTop: 6,
              fontSize: 14,
              color: "#667085",
              lineHeight: 20,
            }}
          >
            Upload study materials for your students or share them with a
            specific batch.
          </Text>
        </View>

        {/* TITLE */}
        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              marginBottom: 8,
              fontSize: 14,
              fontWeight: "700",
              color: "#111827",
            }}
          >
            Title
          </Text>

          <TextInput
            placeholder="Physics Notes - Chapter 1"
            value={title}
            onChangeText={setTitle}
            style={{
              height: 56,
              backgroundColor: "#FFF",
              borderRadius: 16,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              fontSize: 15,
              color: "#111827",
            }}
          />
        </View>

        {/* DESCRIPTION */}
        <View style={{ marginTop: 18 }}>
          <Text
            style={{
              marginBottom: 8,
              fontSize: 14,
              fontWeight: "700",
              color: "#111827",
            }}
          >
            Description
          </Text>

          <TextInput
            placeholder="Add a short description..."
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            style={{
              minHeight: 120,
              backgroundColor: "#FFF",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingTop: 14,
              paddingBottom: 14,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              fontSize: 15,
              color: "#111827",
            }}
          />
        </View>

        {/* SHARE WITH */}
        <View style={{ marginTop: 22 }}>
          <Text
            style={{
              marginBottom: 10,
              fontSize: 14,
              fontWeight: "700",
              color: "#111827",
            }}
          >
            Share With
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setTargetType("all");
                setSelectedBatch(null);
              }}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: targetType === "all" ? "#4F46E5" : "#FFF",
                borderWidth: 1,
                borderColor: targetType === "all" ? "#4F46E5" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  color: targetType === "all" ? "#FFF" : "#111827",
                }}
              >
                All Students
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTargetType("batch")}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: targetType === "batch" ? "#4F46E5" : "#FFF",
                borderWidth: 1,
                borderColor: targetType === "batch" ? "#4F46E5" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  color: targetType === "batch" ? "#FFF" : "#111827",
                }}
              >
                Specific Batch
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SELECTED BATCH */}
        {targetType === "batch" && selectedBatch && (
          <View
            style={{
              marginTop: 14,
              backgroundColor: "#EEF2FF",
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor: "#C7D2FE",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <CheckCircle2 size={22} color="#4F46E5" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                {selectedBatch.batch_name}
              </Text>
              <Text
                style={{
                  marginTop: 3,
                  fontSize: 13,
                  color: "#667085",
                }}
              >
                Class {selectedBatch.class_name} •{" "}
                {selectedBatch.batch_category} • {selectedBatch.year}
              </Text>
            </View>
          </View>
        )}

        {/* BATCH LIST */}
        {targetType === "batch" && (
          <View style={{ marginTop: 16 }}>
            <Text
              style={{
                marginBottom: 10,
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
                  paddingVertical: 24,
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
                  borderRadius: 18,
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
              <View style={{ gap: 10 }}>
                {batches.map((batch) => {
                  const isSelected =
                    selectedBatch?.id === batch.id ||
                    selectedBatch?.batch_id === batch.batch_id;

                  return (
                    <TouchableOpacity
                      key={batch.id || batch.batch_id}
                      onPress={() => setSelectedBatch(batch)}
                      style={{
                        backgroundColor: isSelected ? "#EEF2FF" : "#FFF",
                        borderRadius: 18,
                        padding: 16,
                        borderWidth: 1.5,
                        borderColor: isSelected ? "#4F46E5" : "#E5E7EB",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 12,
                          backgroundColor: isSelected ? "#4F46E5" : "#FFF",
                          borderWidth: 2,
                          borderColor: isSelected ? "#4F46E5" : "#CBD5E1",
                        }}
                      >
                        {isSelected && <CheckCircle2 size={14} color="#FFF" />}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "700",
                            color: "#111827",
                          }}
                        >
                          {batch.batch_name}
                        </Text>

                        <Text
                          style={{
                            marginTop: 4,
                            color: "#667085",
                            fontSize: 13,
                          }}
                        >
                          Class {batch.class_name} • {batch.batch_category} •{" "}
                          {batch.year}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* MODE SELECTOR */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 22,
            gap: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setInputMode("file")}
            style={{
              flex: 1,
              height: 50,
              borderRadius: 14,
              backgroundColor: inputMode === "file" ? "#4F46E5" : "#FFF",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: inputMode === "file" ? "#4F46E5" : "#E5E7EB",
            }}
          >
            <Text
              style={{
                color: inputMode === "file" ? "#FFF" : "#111827",
                fontWeight: "700",
              }}
            >
              Upload File
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setInputMode("text");
              setNoteType("text");
              setFileName("");
              setFileUri("");
            }}
            style={{
              flex: 1,
              height: 50,
              borderRadius: 14,
              backgroundColor: inputMode === "text" ? "#4F46E5" : "#FFF",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: inputMode === "text" ? "#4F46E5" : "#E5E7EB",
            }}
          >
            <Text
              style={{
                color: inputMode === "text" ? "#FFF" : "#111827",
                fontWeight: "700",
              }}
            >
              Type Note
            </Text>
          </TouchableOpacity>
        </View>

        {/* FILE MODE */}
        {inputMode === "file" && (
          <View style={{ marginTop: 22 }}>
            <Text
              style={{
                marginBottom: 8,
                fontSize: 14,
                fontWeight: "700",
                color: "#111827",
              }}
            >
              File
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handlePickFile}
              style={{
                backgroundColor: "#FFF",
                borderRadius: 18,
                borderWidth: 1.5,
                borderStyle: "dashed",
                borderColor: "#D0D5DD",
                padding: 22,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  backgroundColor: "#EEF2FF",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FileText size={26} color="#4F46E5" />
              </View>

              <Text
                style={{
                  marginTop: 12,
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                Select File
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  color: "#667085",
                }}
              >
                PDF, Image or DOCX
              </Text>
            </TouchableOpacity>

            {!!fileName && (
              <View
                style={{
                  marginTop: 16,
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
                  Selected File
                </Text>

                <Text
                  numberOfLines={2}
                  style={{
                    marginTop: 4,
                    color: "#111827",
                    fontWeight: "600",
                  }}
                >
                  {fileName}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* TEXT MODE */}
        {inputMode === "text" && (
          <View style={{ marginTop: 22 }}>
            <Text
              style={{
                marginBottom: 8,
                fontSize: 14,
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Note Content
            </Text>

            <TextInput
              placeholder="Type your study notes here..."
              multiline
              value={typedNote}
              onChangeText={setTypedNote}
              textAlignVertical="top"
              style={{
                minHeight: 220,
                backgroundColor: "#FFF",
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                fontSize: 15,
                color: "#111827",
              }}
            />
          </View>
        )}
      </ScrollView>

      {/* UPLOAD BUTTON */}
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
          onPress={handleUploadNote}
          style={{
            height: 56,
            borderRadius: 18,
            backgroundColor: uploading ? "#A5B4FC" : "#4F46E5",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.14,
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
                Uploading...
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
              Upload Note
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}