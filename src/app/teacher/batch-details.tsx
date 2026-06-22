import {
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
  ClipboardList,
  FileText,
  PlayCircle,
  Users,
  BookOpen,
  Layers3,
  MessageSquareText,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function BatchDetailsScreen() {
  const params = useLocalSearchParams<{
    batchId?: string;
    batchName?: string;
    batchCategory?: string;
    className?: string;
    year?: string;
    totalStudents?: string;
  }>();

  const batchName = params.batchName ?? "Batch Details";
  const batchId = params.batchId ?? "";
  const batchCategory = params.batchCategory ?? "Batch";
  const className = params.className ?? "N/A";
  const year = params.year ?? "N/A";
  const totalStudents = params.totalStudents ?? "0";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}
    >
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

            <Text
              style={{
                marginLeft: 14,
                fontSize: 28,
                fontWeight: "800",
                color: "#111827",
              }}
            >
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
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                {batchName}
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: "#667085",
                }}
              >
                {batchId} • {batchCategory}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "#DCFCE7",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#059669",
                }}
              >
                Active
              </Text>
            </View>
          </View>

          {/* META */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 24,
              gap: 12,
            }}
          >
            <InfoBox title="Class" value={className} />
            <InfoBox title="Year" value={year} />
            <InfoBox title="Students" value={totalStudents} />
          </View>
        </View>

        {/* OVERVIEW */}
        <SectionTitle
          title="Overview"
          subtitle="Quick access to batch tools and learning resources"
        />

        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 14,
            gap: 14,
          }}
        >
          <QuickCard
            icon={Bell}
            title="Announcements"
            subtitle="Targeted announcements for this batch"
            bg="#EEE8FF"
            color="#6C63FF"
            onPress={() => {
              AlertNotReady("Announcements");
            }}
          />

<QuickCard
  icon={ClipboardList}
  title="Tasks / DPP"
  subtitle="Assigned tasks and homework"
  bg="#DBEAFE"
  color="#2563EB"
  onPress={() =>
    router.push({
      pathname: "/teacher/create-task",
      params: {
        batchId: params.batchId,
        batchName: params.batchName,
        batchCategory: params.batchCategory,
        className: params.className,
        year: params.year,
      },
    })
  }
/>

          <QuickCard
            icon={PlayCircle}
            title="YouTube Playlists"
            subtitle="Private lecture playlists"
            bg="#FEE2E2"
            color="#DC2626"
            onPress={() => {
              AlertNotReady("YouTube Playlists");
            }}
          />

          <QuickCard
            icon={FileText}
            title="Notes"
            subtitle="View and manage shared notes"
            bg="#E0E7FF"
            color="#4F46E5"
            onPress={() =>
              router.push({
                pathname: "/teacher/batch-notes",
                params: {
                  batchId,
                  batchName,
                },
              })
            }
          />

          <QuickCard
            icon={Users}
            title="Students"
            subtitle="Manage enrolled students"
            bg="#DCFCE7"
            color="#10B981"
            onPress={() => {
              AlertNotReady("Students");
            }}
          />

          <QuickCard
            icon={BookOpen}
            title="Add Playlist"
            subtitle="Assign YouTube playlist to this batch"
            bg="#FEE2E2"
            color="#DC2626"
            onPress={() =>
              router.push({
                pathname: "/teacher/add-playlist",
                params: {
                  batchId,
                  batchName,
                },
              })
            }
          />

          <QuickCard
            icon={Layers3}
            title="Batch Resources"
            subtitle="Coming soon"
            bg="#ECFDF5"
            color="#059669"
            onPress={() => {
              AlertNotReady("Batch Resources");
            }}
          />

          <QuickCard
            icon={MessageSquareText}
            title="Batch Chat"
            subtitle="Coming soon"
            bg="#FFF7ED"
            color="#EA580C"
            onPress={() => {
              AlertNotReady("Batch Chat");
            }}
          />
        </View>

        {/* NOTES HIGHLIGHT */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 22,
            backgroundColor: "#4F46E5",
            borderRadius: 24,
            padding: 18,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#FFF",
            }}
          >
            Notes
          </Text>

          <Text
            style={{
              marginTop: 6,
              fontSize: 13,
              lineHeight: 19,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Open the notes history for this batch, preview shared files, and
            manage uploaded study material.
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/teacher/batch-notes",
                params: {
                  batchId,
                  batchName,
                },
              })
            }
            style={{
              marginTop: 16,
              backgroundColor: "#FFF",
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#4F46E5",
                fontWeight: "800",
              }}
            >
              Open Notes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        marginTop: 28,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {title}
      </Text>

      {!!subtitle && (
        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            lineHeight: 18,
            color: "#667085",
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}

function QuickCard({
  icon: Icon,
  title,
  subtitle,
  bg,
  color,
  onPress,
}: any) {
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
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
      }}
    >
      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 18,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 14,
        }}
      >
        <Icon size={24} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#111827",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            color: "#667085",
            lineHeight: 18,
          }}
        >
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
        backgroundColor: "#F8FAFC",
        borderRadius: 18,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: "#98A2B3",
          fontWeight: "600",
        }}
      >
        {title}
      </Text>

      <Text
        numberOfLines={1}
        style={{
          marginTop: 5,
          fontSize: 15,
          fontWeight: "700",
          color: "#111827",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function AlertNotReady(feature: string) {
  Alert.alert(
    feature,
    "This section is not connected yet."
  );
}