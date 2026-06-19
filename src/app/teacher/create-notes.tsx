import { useAuthStore } from "@/store/authStore";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getBatchesByTeacher } from "@/services/batches";

import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import * as DocumentPicker from "expo-document-picker";

import { FileText } from "lucide-react-native";

import { supabase } from "@/lib/supabase";

export default function CreateNoteScreen() {

  const params = useLocalSearchParams();

  const [typedNote, setTypedNote] = useState("");

  const [inputMode, setInputMode] = useState<"file" | "text">("file");

  const [noteType, setNoteType] = useState<
  "pdf" | "image" | "docx" | "text"
>("pdf");

  const { teacher } = useAuthStore();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [fileName, setFileName] = useState("");

  const [fileUri, setFileUri] = useState("");

  const [uploading, setUploading] = useState(false);

const [targetType, setTargetType] = useState("all");

const [batches, setBatches] = useState<any[]>([]);

const [selectedBatch, setSelectedBatch] = useState<any>(null);

  async function handlePickPdf() {
    const result = await DocumentPicker.getDocumentAsync({
  type: [
    "application/pdf",
    "image/*",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  copyToCacheDirectory: true,
});

    if (result.canceled) return;

const file = result.assets[0];
const name = file.name.toLowerCase();

if (name.endsWith(".pdf")) {
  setNoteType("pdf");
} else if (
  name.endsWith(".jpg") ||
  name.endsWith(".jpeg") ||
  name.endsWith(".png")
) {
  setNoteType("image");
} else if (name.endsWith(".docx")) {
  setNoteType("docx");
}
console.log("FILE URI:", file.uri);

setFileName(file.name);
setFileUri(file.uri);

    Alert.alert("PDF Selected", file.name);
  }

async function uploadPdf() {
  try {
    if (!title.trim()) {
      Alert.alert("Required", "Please enter title.");
      return;
    }

    setUploading(true);

    // TEXT NOTE
    if (inputMode === "text") {
      if (!typedNote.trim()) {
        Alert.alert("Required", "Please enter note content.");
        return;
      }

const noteResponse = await supabase
  .from("notes")
  .insert({
    teacher_id: teacher?.id,

    titile: title,

    description,

    note_type: "text",

    note_content: typedNote,

    target_type: targetType,

    batch_id:
      targetType === "batch"
        ? selectedBatch?.batch_id
        : null,

    batch_name:
      targetType === "batch"
        ? selectedBatch?.batch_name
        : null,

    batch_category:
      targetType === "batch"
        ? selectedBatch?.batch_category
        : null,

    class_name:
      targetType === "batch"
        ? selectedBatch?.class_name
        : null,

    year:
      targetType === "batch"
        ? selectedBatch?.year
        : null,
  });

      if (noteResponse.error) {
        Alert.alert(
          "Database Error",
          noteResponse.error.message
        );

        return;
      }

      Alert.alert(
        "Success",
        "Text note saved successfully."
      );

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

    const { data } = supabase.storage
      .from("notes")
      .getPublicUrl(filePath);

const noteResponse = await supabase
  .from("notes")
  .insert({
    teacher_id: teacher?.id,

    titile: title,

    description,

    file_name: fileName,

    file_url: data.publicUrl,

    note_type: noteType,

    target_type: targetType,

    batch_id:
      targetType === "batch"
        ? selectedBatch?.batch_id
        : null,

    batch_name:
      targetType === "batch"
        ? selectedBatch?.batch_name
        : null,

    batch_category:
      targetType === "batch"
        ? selectedBatch?.batch_category
        : null,

    class_name:
      targetType === "batch"
        ? selectedBatch?.class_name
        : null,

    year:
      targetType === "batch"
        ? selectedBatch?.year
        : null,
  });

    if (noteResponse.error) {
      Alert.alert(
        "Database Error",
        noteResponse.error.message
      );

      return;
    }

    Alert.alert(
      "Success",
      "Note uploaded successfully."
    );

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

    const response =
      await getBatchesByTeacher(
        teacher.id
      );

    if (response.success) {
      const loadedBatches =
        response.data || [];

      setBatches(
        loadedBatches
      );

      // AUTO SELECT BATCH
      if (
        params.batchId &&
        params.batchName
      ) {
        const foundBatch =
          loadedBatches.find(
            (batch) =>
              batch.batch_id ==
              params.batchId
          );

        if (foundBatch) {
          setTargetType(
            "batch"
          );

          setSelectedBatch(
            foundBatch
          );
        }
      }
    }
  }

  loadBatches();
}, [teacher]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 140,
        }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: "#111827",
          }}>
          Share Notes
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 14,
            color: "#667085",
          }}>
          Upload study materials for your students.
        </Text>

        {/* TITLE */}
        <View
          style={{
            marginTop: 28,
          }}>
          <Text
            style={{
              marginBottom: 8,
              fontSize: 14,
              fontWeight: "700",
              color: "#111827",
            }}>
            Title
          </Text>

          <TextInput
            placeholder="Physics Notes - Chapter 1"
            value={title}
            onChangeText={setTitle}
            style={{
              height: 54,
              backgroundColor: "#FFF",
              borderRadius: 16,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          />
        </View>

        {/* DESCRIPTION */}
        <View
          style={{
            marginTop: 18,
          }}>
          <Text
            style={{
              marginBottom: 8,
              fontSize: 14,
              fontWeight: "700",
              color: "#111827",
            }}>
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
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          />
        </View>

{/* TARGET AUDIENCE */}
<View
  style={{
    marginTop: 22,
  }}>
  <Text
    style={{
      marginBottom: 10,
      fontSize: 14,
      fontWeight: "700",
      color: "#111827",
    }}>
    Share With
  </Text>

  <View
    style={{
      flexDirection: "row",
      gap: 10,
    }}>
    <TouchableOpacity
      onPress={() => {
        setTargetType("all");
        setSelectedBatch(null);
      }}
      style={{
        flex: 1,
        height: 50,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
          targetType === "all"
            ? "#4F46E5"
            : "#FFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
      }}>
      <Text
        style={{
          fontWeight: "700",
          color:
            targetType === "all"
              ? "#FFF"
              : "#111827",
        }}>
        All Students
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() =>
        setTargetType("batch")
      }
      style={{
        flex: 1,
        height: 50,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
          targetType === "batch"
            ? "#4F46E5"
            : "#FFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
      }}>
      <Text
        style={{
          fontWeight: "700",
          color:
            targetType === "batch"
              ? "#FFF"
              : "#111827",
        }}>
        Specific Batch
      </Text>
    </TouchableOpacity>
  </View>
</View>

{/* BATCH LIST */}
{targetType === "batch" && (
  <View
    style={{
      marginTop: 16,
      gap: 10,
    }}>
    {batches.map((batch) => (
      <TouchableOpacity
        key={batch.id}
        onPress={() =>
          setSelectedBatch(batch)
        }
        style={{
          backgroundColor:
            selectedBatch?.id === batch.id
              ? "#EEF2FF"
              : "#FFF",
          borderRadius: 18,
          padding: 16,
          borderWidth: 1.5,
          borderColor:
            selectedBatch?.id === batch.id
              ? "#4F46E5"
              : "#E5E7EB",
        }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: "#111827",
          }}>
          {batch.batch_name}
        </Text>

        <Text
          style={{
            marginTop: 4,
            color: "#667085",
            fontSize: 13,
          }}>
          Class {batch.class_name} •{" "}
          {batch.batch_category} •{" "}
          {batch.year}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)}

        {/* MODE SELECTOR */}
<View
  style={{
    flexDirection: "row",
    marginTop: 22,
    gap: 10,
  }}>
  <TouchableOpacity
    onPress={() => setInputMode("file")}
    style={{
      flex: 1,
      height: 48,
      borderRadius: 14,
      backgroundColor:
        inputMode === "file" ? "#4F46E5" : "#FFF",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#E5E7EB",
    }}>
    <Text
      style={{
        color:
          inputMode === "file" ? "#FFF" : "#111827",
        fontWeight: "700",
      }}>
      Upload File
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => {
      setInputMode("text");
      setNoteType("text");
    }}
    style={{
      flex: 1,
      height: 48,
      borderRadius: 14,
      backgroundColor:
        inputMode === "text" ? "#4F46E5" : "#FFF",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#E5E7EB",
    }}>
    <Text
      style={{
        color:
          inputMode === "text" ? "#FFF" : "#111827",
        fontWeight: "700",
      }}>
      Type Note
    </Text>
  </TouchableOpacity>
</View>

{/* FILE MODE */}
{inputMode === "file" && (
  <View
    style={{
      marginTop: 22,
    }}>
    <Text
      style={{
        marginBottom: 8,
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
      }}>
      File
    </Text>

    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePickPdf}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 18,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#D0D5DD",
        padding: 22,
        alignItems: "center",
      }}>
      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          backgroundColor: "#EEF2FF",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <FileText
          size={26}
          color="#4F46E5"
        />
      </View>

      <Text
        style={{
          marginTop: 12,
          fontSize: 15,
          fontWeight: "700",
          color: "#111827",
        }}>
        Select File
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 13,
          color: "#667085",
        }}>
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
        }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "#059669",
          }}>
          Selected File
        </Text>

        <Text
          style={{
            marginTop: 4,
            color: "#111827",
          }}>
          {fileName}
        </Text>
      </View>
    )}
  </View>
)}

{/* TEXT MODE */}
{inputMode === "text" && (
  <View
    style={{
      marginTop: 22,
    }}>
    <Text
      style={{
        marginBottom: 8,
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
      }}>
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
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={uploading}
          onPress={uploadPdf}
          style={{
            height: 56,
            borderRadius: 18,
            backgroundColor: "#4F46E5",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text
            style={{
              color: "#FFF",
              fontSize: 16,
              fontWeight: "700",
            }}>
            {uploading
              ? "Uploading..."
              : "Upload Note"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}