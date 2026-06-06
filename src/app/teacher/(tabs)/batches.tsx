import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AppScrollView from "@/components/AppScrollView";

import { useRefresh } from "@/context/RefreshContext";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  Archive,
  ArrowLeft,
  Layers3,
  Plus,
  RotateCcw,
  Users,
} from "lucide-react-native";

import { router } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { getBatchesByTeacher } from "@/services/batches";

export default function BatchesScreen() {
  const { teacher } = useAuthStore();

  const { refreshKey } = useRefresh();

  const [batches, setBatches] = useState<any[]>([]);

  const [archivedBatches, setArchivedBatches] = useState<any[]>([]);

  const [archivedIds, setArchivedIds] = useState<string[]>([]);

const [viewMode, setViewMode] = useState<"all" | "active" | "archived">(
  "active",
);

  async function loadBatches() {
    if (!teacher?.id) return;

    const response = await getBatchesByTeacher(teacher.id);

    if (response.success) {
      const freshBatches = response.data || [];

      setBatches(freshBatches.filter((batch: any) => !archivedIds.includes(batch.id)));
    }
  }



  useEffect(() => {
  loadBatches();
}, [teacher, refreshKey]);

  function handleArchiveBatch(batch: any) {
    Alert.alert(
      "Archive Batch",
      `Move ${batch.batch_name} to archived batches?`,
      [  
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Archive",
          onPress: () => {
            setBatches((prev) => prev.filter((item) => item.id !== batch.id));

            setArchivedBatches((prev) => {
              const alreadyExists = prev.some((item) => item.id === batch.id);

              if (alreadyExists) return prev;

              return [
                {
                  ...batch,
                  archived: true,
                },
                ...prev,
              ];
            });

            setArchivedIds((prev) => {
              if (prev.includes(batch.id)) return prev;

              return [...prev, batch.id];
            });

            setViewMode("archived");
          },
        },
      ],
    );
  }

  function handleRestoreBatch(batch: any) {
    setArchivedBatches((prev) => prev.filter((item) => item.id !== batch.id));

    setArchivedIds((prev) => prev.filter((id) => id !== batch.id));

    setBatches((prev) => {
      const alreadyExists = prev.some((item) => item.id === batch.id);

      if (alreadyExists) return prev;

      return [batch, ...prev];
    });

    setViewMode("active");
  }

const visibleBatches =
  viewMode === "all"
    ? [...batches, ...archivedBatches]
    : viewMode === "archived"
      ? archivedBatches
      : batches;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <View style={{ flex: 1 }}>
        <AppScrollView
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
                  marginLeft: 12,
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Batches
              </Text>
            </View>
          </View>

          {/* STATS */}
{/* STATS */}
<View
  style={{
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 22,
    gap: 12,
    justifyContent: "center",
  }}>
  <StatCard
    title="Total"
    value={`${batches.length + archivedBatches.length}`}
    bg="#EEE8FF"
    color="#6C63FF"
    active={viewMode === "all"}
    onPress={() => setViewMode("all")}
  />

  <StatCard
    title="Active"
    value={`${batches.length}`}
    bg="#DCFCE7"
    color="#10B981"
    active={viewMode === "active"}
    onPress={() => setViewMode("active")}
  />

  <StatCard
    title="Archived"
    value={`${archivedBatches.length}`}
    bg="#E5E7EB"
    color="#374151"
    active={viewMode === "archived"}
    onPress={() => setViewMode("archived")}
  />
</View>

          {/* SECTION TITLE */}
         <Text
  style={{
    paddingHorizontal: 20,
    marginTop: 24,
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  }}>
 {viewMode === "all"
  ? "All Batches"
  : viewMode === "archived"
    ? "Archived Batches"
    : "Active Batches"}
</Text>

          {/* LIST */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 14,
            }}>
            {visibleBatches.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 24,
                  padding: 30,
                  alignItems: "center",
                }}>
                <Layers3 size={42} color="#98A2B3" />

                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#111827",
                  }}>
                  {viewMode === "archived"
                    ? "No Archived Batches"
                    : "No Batches Yet"}
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "#667085",
                    textAlign: "center",
                  }}>
                  {viewMode === "archived"
                    ? "Archived batches will appear here"
                    : "Create your first batch to organize students"}
                </Text>
              </View>
            ) : (
              visibleBatches.map((batch, index) => (
  <BatchCard
    key={batch.id || index}
    batch={batch}
    archived={archivedBatches.some((item) => item.id === batch.id)}
    onArchive={() => handleArchiveBatch(batch)}
    onRestore={() => handleRestoreBatch(batch)}
  />
))
            )}
          </View>
</AppScrollView>
        {/* FAB */}
        {viewMode === "active" && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/teacher/create-batch")}
            style={{
              position: "absolute",
              right: 20,
              bottom: 100,
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
        )}
      </View>
    </SafeAreaView>
  );
}

function BatchCard({
  batch,
  archived,
  onArchive,
  onRestore,
}: {
  batch: any;
  archived: boolean;
  onArchive: () => void;
  onRestore: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/teacher/batch-details",

          params: {
            id: batch.id,

            batchId: batch.batch_id,

            batchName: batch.batch_name,

            batchCategory: batch.batch_category,

            batchNumber: batch.batch_number,

            className: batch.class_name,

            year: batch.year,

            totalStudents: batch.total_students,

            active: batch.is_active ? "true" : "false",

            admissionOpen: batch.admission_open ? "true" : "false",
          },
        })
      }
      style={{
        backgroundColor: "#FFF",
        borderRadius: 26,
        padding: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
        opacity: archived ? 0.86 : 1,
      }}>
      {/* TOP */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 19,
              fontWeight: "800",
              color: "#111827",
            }}>
            {batch.batch_name}
          </Text>

          <Text
            style={{
              marginTop: 6,
              fontSize: 14,
              color: "#667085",
            }}>
            {batch.batch_id} • {batch.batch_category}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}>
          <View
            style={{
              backgroundColor: archived
                ? "#E5E7EB"
                : batch.is_active
                  ? "#DCFCE7"
                  : "#F3F4F6",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: archived
                  ? "#374151"
                  : batch.is_active
                    ? "#10B981"
                    : "#667085",
              }}>
              {archived ? "Archived" : batch.is_active ? "Active" : "Inactive"}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={(event) => {
              event.stopPropagation();

              archived ? onRestore() : onArchive();
            }}
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              backgroundColor: archived ? "#DCFCE7" : "#F3F4F6",
              justifyContent: "center",
              alignItems: "center",
            }}>
            {archived ? (
              <RotateCcw size={17} color="#059669" />
            ) : (
              <Archive size={17} color="#4B5563" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* META */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
        }}>
        <InfoBox title="Class" value={batch.class_name || "-"} />

        <InfoBox title="Batch" value={batch.batch_number || "-"} />

        <InfoBox title="Year" value={batch.year || "-"} />
      </View>

      {/* FOOTER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 22,
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <Users size={16} color="#6C63FF" />

          <Text
            style={{
              marginLeft: 8,
              fontSize: 13,
              fontWeight: "700",
              color: "#6C63FF",
            }}>
            {batch.total_students || 0} Students
          </Text>
        </View>

        <View
          style={{
            backgroundColor: batch.admission_open ? "#DBEAFE" : "#F3F4F6",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: batch.admission_open ? "#2563EB" : "#667085",
            }}>
            {batch.admission_open ? "Admissions Open" : "Admissions Closed"}
          </Text>
        </View>
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

function StatCard({
  title,
  value,
  bg,
  color,
  active,
  onPress,
}: {
  title: string;

  value: string;

  bg: string;

  color: string;

  active?: boolean;

  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: bg,
        borderRadius: 18,
        paddingVertical: 18,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: active ? 1.8 : 0,
        borderColor: color,
      }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "700",
          color,
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 10,
          fontSize: 22,
          fontWeight: "900",
          color: "#111827",
        }}>
        {value}
      </Text>
    </TouchableOpacity>
  );
}