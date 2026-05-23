import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useEffect, useMemo, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Bell, Layers3, Plus, Users } from "lucide-react-native";

import { router } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { getAnnouncementsByTeacher } from "@/services/announcements";

export default function AnnouncementsScreen() {
  const { teacher } = useAuthStore();

  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    async function loadAnnouncements() {
      if (!teacher?.id) return;

      const response = await getAnnouncementsByTeacher(teacher.id);

      if (response.success) {
        setAnnouncements(response.data || []);
      }
    }

    loadAnnouncements();
  }, [teacher]);

  const todayCount = useMemo(() => {
    return announcements.filter((item) => {
      const today = new Date().toDateString();

      return new Date(item.created_at).toDateString() === today;
    }).length;
  }, [announcements]);

  const targetedCount = useMemo(() => {
    return announcements.filter((item) => item.target_type !== "all").length;
  }, [announcements]);

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
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Announcements
              </Text>
            </View>
          </View>

          {/* STATS */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              marginTop: 22,
              gap: 12,
            }}>
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

          {/* LIST */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 24,
            }}>
            {announcements.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 28,
                  padding: 34,
                  alignItems: "center",
                }}>
                <Bell size={44} color="#98A2B3" />

                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 17,
                    fontWeight: "800",
                    color: "#111827",
                  }}>
                  No Announcements
                </Text>

                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: "#667085",
                    textAlign: "center",
                    lineHeight: 20,
                  }}>
                  Create your first announcement to notify students
                </Text>
              </View>
            ) : (
              announcements.map((announcement, index) => (
                <AnnouncementCard
                  key={index}
                  title={announcement.title}
                  message={announcement.message}
                  targetType={announcement.target_type}
                  batchName={announcement.batch_name}
                  batchCategory={announcement.batch_category}
                  className={announcement.class_name}
                  time={formatTimeAgo(announcement.created_at)}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/teacher/create-announcement")}
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
          }}>
          <Plus size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function AnnouncementCard({
  title,
  message,
  targetType,
  batchName,
  batchCategory,
  className,
  time,
}: {
  title: string;

  message: string;

  targetType: string;

  batchName?: string;

  batchCategory?: string;

  className?: string;

  time: string;
}) {
  function getAudienceLabel() {
    if (targetType === "all") {
      return "All Students";
    }

    if (targetType === "batch") {
      return batchName;
    }

    if (targetType === "category") {
      return batchCategory;
    }

    if (targetType === "class") {
      return `Class ${className}`;
    }

    return "Students";
  }

  function getAudienceColor() {
    if (targetType === "all") {
      return {
        bg: "#EEF2FF",
        color: "#4F46E5",
      };
    }

    if (targetType === "batch") {
      return {
        bg: "#DCFCE7",
        color: "#10B981",
      };
    }

    if (targetType === "category") {
      return {
        bg: "#FEF3C7",
        color: "#D97706",
      };
    }

    return {
      bg: "#DBEAFE",
      color: "#2563EB",
    };
  }

  const audienceStyle = getAudienceColor();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 22,
        padding: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      <View
        style={{
          flexDirection: "row",
        }}>
        {/* ICON */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 16,
            backgroundColor: "#EEE8FF",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}>
          <Bell size={20} color="#6C63FF" />
        </View>

        {/* CONTENT */}
        <View style={{ flex: 1 }}>
          {/* TOP */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: 15,
                fontWeight: "800",
                color: "#111827",
                paddingRight: 10,
              }}>
              {title}
            </Text>

            <Text
              style={{
                fontSize: 11,
                color: "#98A2B3",
              }}>
              {time}
            </Text>
          </View>

          {/* TARGET */}
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
            }}>
            {targetType === "batch" ? (
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
              }}>
              {getAudienceLabel()}
            </Text>
          </View>

          {/* MESSAGE */}
          <Text
            numberOfLines={2}
            style={{
              marginTop: 10,
              fontSize: 13,
              lineHeight: 20,
              color: "#667085",
            }}>
            {message}
          </Text>
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
      }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "700",
          color,
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 19,
          fontWeight: "800",
          color: "#111827",
        }}>
        {value}
      </Text>
    </View>
  );
}

function formatTimeAgo(dateString: string) {
  const now = new Date();

  const date = new Date(dateString);

  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);

  const hours = Math.floor(minutes / 60);

  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${days}d ago`;
}
