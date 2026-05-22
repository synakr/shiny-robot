import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Bell, Plus } from "lucide-react-native";

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

            <StatCard title="Today" value="4" bg="#DCFCE7" color="#10B981" />

            <StatCard title="Batches" value="3" bg="#FEF3C7" color="#F59E0B" />
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
                  borderRadius: 24,
                  padding: 30,
                  alignItems: "center",
                }}>
                <Bell size={42} color="#98A2B3" />

                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#111827",
                  }}>
                  No Announcements
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "#667085",
                    textAlign: "center",
                  }}>
                  Create your first announcement
                </Text>
              </View>
            ) : (
              announcements.map((announcement, index) => (
                <AnnouncementCard
                  key={index}
                  title={announcement.title}
                  message={announcement.message}
                  batch={announcement.batch_name}
                  time="2 hours ago"
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
  batch,
  time,
}: {
  title: string;

  message: string;

  batch: string;

  time: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
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
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: "#EEE8FF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 14,
            }}>
            <Bell size={22} color="#6C63FF" />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: "#111827",
              }}>
              {title}
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontSize: 13,
                color: "#667085",
              }}>
              {batch}
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 12,
            color: "#98A2B3",
          }}>
          {time}
        </Text>
      </View>

      {/* MESSAGE */}
      <Text
        style={{
          marginTop: 16,
          fontSize: 14,
          lineHeight: 22,
          color: "#667085",
        }}>
        {message}
      </Text>
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
        borderRadius: 18,
        paddingVertical: 12,
        alignItems: "center",
      }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color,
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 18,
          fontWeight: "800",
          color: "#111827",
        }}>
        {value}
      </Text>
    </View>
  );
}
