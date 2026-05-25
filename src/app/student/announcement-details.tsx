import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Bell, Layers3, Users } from "lucide-react-native";

import { router } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { getAnnouncementsForStudent } from "@/services/student-announcements";

export default function AnnouncementDetailsScreen() {
  const { student } = useAuthStore();

  const [announcements, setAnnouncements] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnnouncements() {
      if (!student) return;

      setLoading(true);

      const response = await getAnnouncementsForStudent(student);

      if (response.success) {
        setAnnouncements(response.data || []);
      }

      setLoading(false);
    }

    loadAnnouncements();
  }, [student]);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString([], {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getTargetLabel(announcement: any) {
    if (announcement.target_type === "all") {
      return "All Students";
    }

    if (announcement.target_type === "batch") {
      return announcement.batch_name;
    }

    if (announcement.target_type === "class") {
      return `Class ${announcement.class_name}`;
    }

    if (announcement.target_type === "category") {
      return announcement.batch_category;
    }

    return "Students";
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
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
              <ArrowLeft size={26} color="#111827" />
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

        {/* LOADING */}
        {loading ? (
          <View
            style={{
              marginTop: 80,
              alignItems: "center",
            }}>
            <ActivityIndicator size="large" color="#6C63FF" />
          </View>
        ) : announcements.length === 0 ? (
          <View
            style={{
              marginTop: 70,
              marginHorizontal: 20,
              backgroundColor: "#FFF",
              borderRadius: 28,
              padding: 36,
              alignItems: "center",
            }}>
            <Bell size={46} color="#98A2B3" />

            <Text
              style={{
                marginTop: 16,
                fontSize: 18,
                fontWeight: "800",
                color: "#111827",
              }}>
              No Announcements
            </Text>

            <Text
              style={{
                marginTop: 8,
                fontSize: 13,
                lineHeight: 20,
                color: "#667085",
                textAlign: "center",
              }}>
              Announcements from your teacher will appear here.
            </Text>
          </View>
        ) : (
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 24,
            }}>
            {announcements.map((announcement, index) => (
              <AnnouncementCard
                key={index}
                title={announcement.title}
                message={announcement.message}
                target={getTargetLabel(announcement)}
                targetType={announcement.target_type}
                createdAt={formatDate(announcement.created_at)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function AnnouncementCard({
  title,
  message,
  target,
  targetType,
  createdAt,
}: {
  title: string;

  message: string;

  target: string;

  targetType: string;

  createdAt: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      {/* TOP */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
        }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            backgroundColor: "#EEE8FF",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 14,
          }}>
          <Bell size={24} color="#6C63FF" />
        </View>

        <View
          style={{
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}>
            <Text
              style={{
                flex: 1,
                fontSize: 16,
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
              {createdAt}
            </Text>
          </View>

          {/* TARGET */}
          <View
            style={{
              marginTop: 12,
              alignSelf: "flex-start",
              backgroundColor: "#F3F4F6",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
            }}>
            {targetType === "batch" ? (
              <Layers3 size={13} color="#6B7280" />
            ) : (
              <Users size={13} color="#6B7280" />
            )}

            <Text
              style={{
                marginLeft: 6,
                fontSize: 12,
                fontWeight: "700",
                color: "#6B7280",
              }}>
              {target}
            </Text>
          </View>
        </View>
      </View>

      {/* MESSAGE */}
      <Text
        style={{
          marginTop: 18,
          fontSize: 14,
          lineHeight: 24,
          color: "#4B5563",
        }}>
        {message}
      </Text>
    </View>
  );
}
