import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Search, SlidersHorizontal } from "lucide-react-native";

import FilterPill from "@/components/FilterPill";
import NotesCard from "@/components/NotesCard";

import { getNotesForStudent } from "@/services/notes";
import { useAuthStore } from "@/store/authStore";

type Note = {
  id: string;
  title: string;
  description: string | null;
  file_name: string | null;
  file_url: string | null;
  note_type: "pdf" | "image" | "docx" | "text";
  target_type: "all" | "batch";
  created_at: string;
};

const filters = [
  { label: "All", value: "All" },
  { label: "Images", value: "Image" },
  { label: "PDF", value: "PDF" },
  { label: "Documents", value: "Document" },
] as const;

export default function NotesScreen() {
  const { student } = useAuthStore();

  const [activeFilter, setActiveFilter] = useState("All");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const loadNotes = useCallback(async () => {
    if (!student?.batch_name) return;

    try {
      setLoading(true);

      const response = await getNotesForStudent(student.batch_name);

      if (!response.success) {
        throw new Error(response.error?.message);
      }

      setNotes(response.data ?? []);
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Unable to load notes",
        "Please check your internet connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [student?.batch_name]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const filteredNotes = useMemo(() => {
    switch (activeFilter) {
      case "Image":
        return notes.filter((note) => note.note_type === "image");

      case "PDF":
        return notes.filter((note) => note.note_type === "pdf");

      case "Document":
        return notes.filter((note) => note.note_type === "docx");

      default:
        return notes;
    }
  }, [notes, activeFilter]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadNotes}
            tintColor="#6C63FF"
          />
        }
        contentContainerStyle={{
          paddingBottom: 110,
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
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: "#111827",
              }}>
              Notes
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 18,
              }}>
              <TouchableOpacity>
                <Search size={24} color="#4B5563" />
              </TouchableOpacity>

              <TouchableOpacity>
                <SlidersHorizontal size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 6,
          }}>
          {filters.map((filter) => (
            <FilterPill
              key={filter.value}
              label={filter.label}
              active={activeFilter === filter.value}
              onPress={() => setActiveFilter(filter.value)}
            />
          ))}
        </ScrollView>

        {/* NOTES */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 10,
          }}>
          {loading ? (
            <View
              style={{
                paddingVertical: 60,
                alignItems: "center",
              }}>
              <ActivityIndicator size="large" color="#6C63FF" />

              <Text
                style={{
                  marginTop: 12,
                  color: "#667085",
                }}>
                Loading notes...
              </Text>
            </View>
          ) : filteredNotes.length === 0 ? (
            <View
              style={{
                paddingVertical: 60,
                alignItems: "center",
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#111827",
                }}>
                No notes found
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: "#667085",
                  textAlign: "center",
                }}>
                Your teacher hasn't shared any notes yet.
              </Text>
            </View>
          ) : (
            filteredNotes.map((item) => {
              const isNew = new Date(item.created_at).getTime() > oneWeekAgo;

              return (
                <NotesCard
                  key={item.id}
                  title={item.title}
                  type={item.note_type.toUpperCase()}
                  size={item.file_name ?? ""}
                  date={new Date(item.created_at).toLocaleDateString()}
                  color="#DDF5EF"
                  file_name={item.file_name}
                  file_url={item.file_url}
                  badge={isNew ? "NEW" : undefined}
                />
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
