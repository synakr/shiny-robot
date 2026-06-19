import { useCallback, useEffect, useState } from "react";
import * as Linking from "expo-linking";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { supabase } from "@/lib/supabase";

type NoteItem = {
  id: string;
  titile: string | null;
  note_type: string | null;
  note_content: string | null;
  file_name: string | null;
  file_url: string | null;
  created_at: string | null;
  batch_id: string | null;
};

export default function BatchNotesScreen() {
  const params = useLocalSearchParams<{
    batchId?: string;
    batchName?: string;
  }>();

  const batchId = params.batchId ?? "";
  const batchName = params.batchName ?? "";

  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    if (!batchId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("batch_id", batchId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("loadNotes error:", error);
      setNotes([]);
      setLoading(false);
      return;
    }

    setNotes((data || []) as NoteItem[]);
    setLoading(false);
  }, [batchId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  function toggleSelection(id: string) {
    setSelectedNotes((current) =>
      current.includes(id)
        ? current.filter((noteId) => noteId !== id)
        : [...current, id]
    );
  }

  function selectAllNotes() {
    setSelectedNotes(notes.map((note) => note.id));
  }

  function deselectAllNotes() {
    setSelectedNotes([]);
  }

  async function deleteStorageFile(fileUrl?: string | null) {
    if (!fileUrl) return;

    try {
      const filePath = fileUrl.includes("/notes/")
        ? fileUrl.split("/notes/")[1]
        : fileUrl.split("/").pop();

      if (filePath) {
        await supabase.storage.from("notes").remove([filePath]);
      }
    } catch (error) {
      console.log("Storage delete error:", error);
    }
  }

  async function deleteSingleNote(note: NoteItem) {
    Alert.alert("Delete Note", "Delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteStorageFile(note.file_url);

          const { error } = await supabase
            .from("notes")
            .delete()
            .eq("id", note.id);

          if (error) {
            Alert.alert("Error", error.message);
            return;
          }

          setSelectedNotes((current) =>
            current.filter((id) => id !== note.id)
          );
          loadNotes();
        },
      },
    ]);
  }

  async function deleteSelectedNotes() {
    if (selectedNotes.length === 0) {
      Alert.alert("No Notes Selected", "Please select notes first.");
      return;
    }

    Alert.alert(
      "Delete Notes",
      `Delete ${selectedNotes.length} selected note(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const notesToDelete = notes.filter((note) =>
              selectedNotes.includes(note.id)
            );

            for (const note of notesToDelete) {
              await deleteStorageFile(note.file_url);
            }

            const { error } = await supabase
              .from("notes")
              .delete()
              .in("id", selectedNotes);

            if (error) {
              Alert.alert("Error", error.message);
              return;
            }

            setSelectedNotes([]);
            loadNotes();
          },
        },
      ]
    );
  }

  function previewNote(note: NoteItem) {
    if (note.note_type === "text") {
      Alert.alert(
        note.titile || "Note",
        note.note_content || "No content available."
      );
      return;
    }

    if (note.file_url) {
      Linking.openURL(note.file_url);
      return;
    }

    Alert.alert("Preview", "This note has no file.");
  }

  const allSelected = notes.length > 0 && selectedNotes.length === notes.length;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>

          <View style={{ marginLeft: 14, flex: 1 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: "#111827",
              }}
            >
              Notes
            </Text>
            <Text
              numberOfLines={1}
              style={{
                marginTop: 2,
                color: "#667085",
                fontSize: 13,
              }}
            >
              {batchName || "Batch Notes"}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={deleteSelectedNotes}>
          <Trash2 size={22} color={selectedNotes.length > 0 ? "#DC2626" : "#CBD5E1"} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          marginTop: 18,
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (allSelected) {
              deselectAllNotes();
            } else {
              selectAllNotes();
            }
          }}
        >
          <Text
            style={{
              color: "#4F46E5",
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            {allSelected ? "Deselect All" : "Select All"}
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: "#667085",
            fontSize: 13,
            fontWeight: "600",
          }}
        >
          {selectedNotes.length > 0
            ? `${selectedNotes.length} selected`
            : `${notes.length} notes`}
        </Text>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 140,
          flexGrow: 1,
        }}
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 120,
                }}
              >
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text
                  style={{
                    marginTop: 12,
                    color: "#667085",
                    fontWeight: "600",
                  }}
                >
                  Loading notes...
                </Text>
              </View>
            );
          }

          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 120,
              }}
            >
              <FileText size={54} color="#CBD5E1" />
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                No Notes Yet
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  color: "#667085",
                  textAlign: "center",
                }}
              >
                Upload your first note for this batch.
              </Text>
            </View>
          );
        }}
        renderItem={({ item }) => {
          const selected = selectedNotes.includes(item.id);

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => toggleSelection(item.id)}
              style={{
                backgroundColor: "#FFF",
                borderRadius: 20,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1.5,
                borderColor: selected ? "#4F46E5" : "#E5E7EB",
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 1,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 2,
                    borderColor: selected ? "#4F46E5" : "#94A3B8",
                    backgroundColor: selected ? "#4F46E5" : "#FFF",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  {selected ? (
                    <CheckCircle2 size={14} color="#FFF" />
                  ) : null}
                </View>

                <FileText size={22} color="#4F46E5" />

                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: 10,
                    fontWeight: "700",
                    flex: 1,
                    color: "#111827",
                  }}
                >
                  {item.file_name || item.titile || "Untitled Note"}
                </Text>
              </View>

              <Text
                style={{
                  marginTop: 6,
                  color: "#667085",
                  fontSize: 13,
                }}
              >
                {item.note_type || "note"}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                }}
              >
                <TouchableOpacity onPress={() => previewNote(item)}>
                  <Text
                    style={{
                      color: "#4F46E5",
                      fontWeight: "700",
                      marginRight: 22,
                    }}
                  >
                    Preview
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteSingleNote(item)}>
                  <Text
                    style={{
                      color: "#DC2626",
                      fontWeight: "700",
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/teacher/create-notes",
            params: {
              batchId,
              batchName,
            },
          })
        }
        style={{
          position: "absolute",
          bottom: 24,
          right: 20,
          backgroundColor: "#4F46E5",
          borderRadius: 28,
          paddingHorizontal: 20,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.16,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
      >
        <Plus size={18} color="#FFF" />
        <Text
          style={{
            color: "#FFF",
            marginLeft: 8,
            fontWeight: "700",
          }}
        >
          Share Note
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}