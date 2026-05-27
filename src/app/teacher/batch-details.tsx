import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    ArrowLeft,
    Bell,
    ClipboardList,
    PlayCircle,
    Users,
} from "lucide-react-native";

import { router, useLocalSearchParams } from "expo-router";

export default function BatchDetailsScreen() {
  const params = useLocalSearchParams();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
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
              Batch Details
            </Text>
          </View>
        </View>

        {/* HERO */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 24,
            backgroundColor: "#FFF",
            borderRadius: 28,
            padding: 20,
          }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                {params.batchName}
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: "#667085",
                }}>
                {params.batchId} • {params.batchCategory}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "#DCFCE7",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#10B981",
                }}>
                Active
              </Text>
            </View>
          </View>

          {/* META */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 24,
            }}>
            <InfoBox title="Class" value={params.className as string} />

            <InfoBox title="Year" value={params.year as string} />

            <InfoBox title="Students" value={`${params.totalStudents}`} />
          </View>
        </View>

        {/* QUICK STATS */}
        <SectionTitle title="Overview" />

        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 14,
            gap: 14,
          }}>
          <QuickCard
            icon={Bell}
            title="Announcements"
            subtitle="Targeted announcements for this batch"
            bg="#EEE8FF"
            color="#6C63FF"
          />

          <QuickCard
            icon={ClipboardList}
            title="Tasks / DPP"
            subtitle="Assigned tasks and homework"
            bg="#DBEAFE"
            color="#2563EB"
          />

          <QuickCard
            icon={PlayCircle}
            title="YouTube Playlists"
            subtitle="Private lecture playlists"
            bg="#FEE2E2"
            color="#DC2626"
          />

          <QuickCard
            icon={Users}
            title="Students"
            subtitle="Manage enrolled students"
            bg="#DCFCE7"
            color="#10B981"
          />
          <QuickCard
            icon={PlayCircle}
            title="Add Playlist"
            subtitle="Assign YouTube playlist to this batch"
            bg="#FEE2E2"
            color="#DC2626"
            onPress={() =>
              router.push({
                pathname: "/teacher/add-playlist",

                params: {
                  batchId: params.batchId,

                  batchName: params.batchName,
                },
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text
      style={{
        paddingHorizontal: 20,
        marginTop: 28,
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
      }}>
      {title}
    </Text>
  );
}

function QuickCard({ icon: Icon, title, subtitle, bg, color, onPress }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 22,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
      }}>
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 18,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 14,
        }}>
        <Icon size={24} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
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
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function InfoBox({
  title,
  value,
}: {
  title: string;

  value: string;
}) {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Text
        style={{
          fontSize: 12,
          color: "#98A2B3",
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 5,
          fontSize: 15,
          fontWeight: "700",
          color: "#111827",
        }}>
        {value}
      </Text>
    </View>
  );
}
