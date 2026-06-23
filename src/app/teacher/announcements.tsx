import { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Layers3,
  Plus,
  Trash2,
  Users,
} from "lucide-react-native";

import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { useAuthStore } from "@/store/authStore";
import { getAnnouncementsByTeacher } from "@/services/announcements";
import { supabase } from "@/lib/supabase";

type Announcement = {
  id: string;
  title: string;
  message: string;
  target_type: "all" | "batch" | "class" | "category" | string;
  batch_name?: string | null;
  batch_category?: string | null;
  class_name?: string | null;
  year?: string | null;
  created_at: string;
};

export default function AnnouncementsScreen() {
  const { teacher } = useAuthStore();

  const params = useLocalSearchParams<{
    batchId?: string;
    batchName?: string;
    batchCategory?: string;
    className?: string;
    year?: string;
  }>();

  const batchIdParam = Array.isArray(params.batchId)
    ? params.batchId[0]
    : params.batchId;

  const batchNameParam = Array.isArray(params.batchName)
    ? params.batchName[0]
    : params.batchName;

  const batchCategoryParam = Array.isArray(params.batchCategory)
    ? params.batchCategory[0]
    : params.batchCategory;

  const classNameParam = Array.isArray(params.className)
    ? params.className[0]
    : params.className;

  const yearParam = Array.isArray(params.year) ? params.year[0] : params.year;

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = useCallback(async () => {
    if (!teacher?.id) {
      setAnnouncements([]);
      setSelectedIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await getAnnouncementsByTeacher(teacher.id);

      if (response.success) {
        const items = (response.data || []) as Announcement[];
        setAnnouncements(items);
        setSelectedIds((current) =>
          current.filter((id) => items.some((item) => item.id === id))
        );
      } else {
        setAnnouncements([]);
        setSelectedIds([]);
      }
    } catch (error) {
      console.log("loadAnnouncements error:", error);
      setAnnouncements([]);
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  }, [teacher?.id]);

  useFocusEffect(
    useCallback(() => {
      loadAnnouncements();
    }, [loadAnnouncements])
  );

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();

    return announcements.filter((item) => {
      if (!item.created_at) return false;
      return new Date(item.created_at).toDateString() === today;
    }).length;
  }, [announcements]);

  const targetedCount = useMemo(() => {
    return announcements.filter((item) => item.target_type !== "all").length;
  }, [announcements]);

  const allSelected =
    announcements.length > 0 && selectedIds.length === announcements.length;

  function toggleSelection(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  }

  function selectAll() {
    setSelectedIds(announcements.map((item) => item.id));
  }

  function deselectAll() {
    setSelectedIds([]);
  }

  async function deleteAnnouncement(id: string) {
    Alert.alert("Delete Announcement", "Delete this announcement?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("announcements")
            .delete()
            .eq("id", id);

          if (error) {
            Alert.alert("Error", error.message);
            return;
          }

          setSelectedIds((current) => current.filter((itemId) => itemId !== id));
          loadAnnouncements();
        },
      },
    ]);
  }

  async function deleteSelectedAnnouncements() {
    if (selectedIds.length === 0) {
      Alert.alert("No Selection", "Please select at least one announcement.");
      return;
    }

    Alert.alert(
      "Delete Announcements",
      `Delete ${selectedIds.length} selected announcement(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("announcements")
              .delete()
              .in("id", selectedIds);

            if (error) {
              Alert.alert("Error", error.message);
              return;
            }

            setSelectedIds([]);
            loadAnnouncements();
          },
        },
      ]
    );
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
                    fontSize: 28,
                    fontWeight: "800",
                    color: "#111827",
                  }}
                >
                  Announcements
                </Text>

                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 13,
                    color: "#667085",
                  }}
                >
                  Manage all batch, class, and targeted announcements
                </Text>

                {!!batchNameParam && (
                  <Text
                    numberOfLines={1}
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: "#94A3B8",
                    }}
                  >
                    Current batch: {batchNameParam}
                  </Text>
                )}
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
            }}
          >
            <StatCard
              title="Total"
              value={`${announcements.length}`}
              bg="#EEE8FF"
              color="#6C63FF"
            />

            <StatCard
              title="Today"
              value={`${todayCount}`}
              bg="#DCFCE7"
              color="#10B981"
            />

            <StatCard
              title="Targeted"
              value={`${targetedCount}`}
              bg="#FEF3C7"
              color="#F59E0B"
            />
          </View>

          {/* ACTION BAR */}
          {announcements.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                marginTop: 18,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (allSelected) {
                    deselectAll();
                  } else {
                    selectAll();
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

              <TouchableOpacity onPress={deleteSelectedAnnouncements}>
                <Trash2
                  size={20}
                  color={selectedIds.length > 0 ? "#DC2626" : "#CBD5E1"}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* LIST */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 18,
            }}
          >
            {loading ? (
              <View
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 28,
                  padding: 34,
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#6C63FF" />
                <Text
                  style={{
                    marginTop: 14,
                    fontSize: 14,
                    color: "#667085",
                    fontWeight: "600",
                  }}
                >
                  Loading announcements...
                </Text>
              </View>
            ) : announcements.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 28,
                  padding: 34,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.03,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <Bell size={44} color="#98A2B3" />

                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 17,
                    fontWeight: "800",
                    color: "#111827",
                  }}
                >
                  No Announcements
                </Text>

                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: "#667085",
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  Create your first announcement to notify students
                </Text>
              </View>
            ) : (
              announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  selected={selectedIds.includes(announcement.id)}
                  onToggle={() => toggleSelection(announcement.id)}
                  onDelete={() => deleteAnnouncement(announcement.id)}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: "/teacher/create-announcement",
              params: {
                batchId: batchIdParam,
                batchName: batchNameParam,
                batchCategory: batchCategoryParam,
                className: classNameParam,
                year: yearParam,
              },
            })
          }
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
          }}
        >
          <Plus size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function AnnouncementCard({
  announcement,
  selected,
  onToggle,
  onDelete,
}: {
  announcement: Announcement;
  selected: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  function getAudienceLabel() {
    if (announcement.target_type === "all") return "All Students";
    if (announcement.target_type === "batch") return announcement.batch_name || "Batch";
    if (announcement.target_type === "category")
      return announcement.batch_category || "Category";
    if (announcement.target_type === "class")
      return `Class ${announcement.class_name || ""}`.trim();
    return "Students";
  }

  function getAudienceStyle() {
    if (announcement.target_type === "all") {
      return { bg: "#EEF2FF", color: "#4F46E5" };
    }

    if (announcement.target_type === "batch") {
      return { bg: "#DCFCE7", color: "#10B981" };
    }

    if (announcement.target_type === "category") {
      return { bg: "#FEF3C7", color: "#D97706" };
    }

    return { bg: "#DBEAFE", color: "#2563EB" };
  }

  const audienceStyle = getAudienceStyle();

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onToggle}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 22,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: selected ? "#6C63FF" : "#E5E7EB",
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            backgroundColor: "#EEE8FF",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          <Bell size={20} color="#6C63FF" />
        </View>

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                {announcement.title}
              </Text>

              <Text
                style={{
                  marginTop: 3,
                  fontSize: 11,
                  color: "#98A2B3",
                }}
              >
                {formatTimeAgo(announcement.created_at)}
              </Text>
            </View>

            <TouchableOpacity onPress={onDelete}>
              <Trash2 size={18} color="#DC2626" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 8,
              alignSelf: "flex-start",
              backgroundColor: audienceStyle.bg,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {announcement.target_type === "batch" ? (
              <Layers3 size={11} color={audienceStyle.color} />
            ) : (
              <Users size={11} color={audienceStyle.color} />
            )}

            <Text
              style={{
                marginLeft: 5,
                fontSize: 11,
                fontWeight: "700",
                color: audienceStyle.color,
              }}
            >
              {getAudienceLabel()}
            </Text>
          </View>

          <Text
            numberOfLines={2}
            style={{
              marginTop: 10,
              fontSize: 13,
              lineHeight: 20,
              color: "#667085",
            }}
          >
            {announcement.message}
          </Text>

          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: selected ? "#6C63FF" : "#CBD5E1",
                backgroundColor: selected ? "#6C63FF" : "#FFF",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 8,
              }}
            >
              {selected ? <CheckCircle2 size={12} color="#FFF" /> : null}
            </View>

            <Text
              style={{
                fontSize: 12,
                color: selected ? "#6C63FF" : "#98A2B3",
                fontWeight: "600",
              }}
            >
              {selected ? "Selected" : "Tap to select"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
        borderRadius: 20,
        paddingVertical: 14,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "700",
          color,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 19,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function formatTimeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diff = now.getTime() - date.getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}