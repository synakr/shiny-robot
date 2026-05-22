import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Layers3, Plus, Users } from "lucide-react-native";

import { router } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { getBatchesByTeacher } from "@/services/batches";

export default function BatchesScreen() {
  const { teacher } = useAuthStore();

  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    async function loadBatches() {
      if (!teacher?.id) return;

      const response = await getBatchesByTeacher(teacher.id);

      if (response.success) {
        setBatches(response.data || []);
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
                Batches
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
              value={`${batches.length}`}
              bg="#EEE8FF"
              color="#6C63FF"
            />

            <StatCard
              title="Active"
              value={`${batches.filter((batch) => batch.is_active).length}`}
              bg="#DCFCE7"
              color="#10B981"
            />

            <StatCard
              title="Students"
              value={`${batches.reduce(
                (total, batch) => total + (batch.total_students || 0),
                0,
              )}`}
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
            {batches.length === 0 ? (
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
                  No Batches Yet
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "#667085",
                    textAlign: "center",
                  }}>
                  Create your first batch to organize students
                </Text>
              </View>
            ) : (
              batches.map((batch, index) => (
                <BatchCard
                  key={index}
                  batchId={batch.batch_id}
                  batchName={batch.batch_name}
                  className={batch.class_name}
                  year={batch.year}
                  totalStudents={batch.total_students}
                  active={batch.is_active}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* FAB */}
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
      </View>
    </SafeAreaView>
  );
}

function BatchCard({
  batchId,
  batchName,
  className,
  year,
  totalStudents,
  active,
}: {
  batchId: string;

  batchName: string;

  className: string;

  year: string;

  totalStudents: number;

  active: boolean;
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
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#111827",
            }}>
            {batchId}
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 14,
              color: "#667085",
            }}>
            {batchName} • Class {className}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: active ? "#DCFCE7" : "#F3F4F6",

            paddingHorizontal: 12,

            paddingVertical: 6,

            borderRadius: 12,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: active ? "#10B981" : "#667085",
            }}>
            {active ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* STATS */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
        }}>
        <InfoBox title="Year" value={year} />

        <InfoBox title="Students" value={`${totalStudents}`} />

        <InfoBox title="Course" value={batchName} />
      </View>

      {/* FOOTER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 18,
        }}>
        <Users size={16} color="#6C63FF" />

        <Text
          style={{
            marginLeft: 8,
            fontSize: 13,
            fontWeight: "600",
            color: "#6C63FF",
          }}>
          Manage Batch
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
          marginTop: 4,
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
