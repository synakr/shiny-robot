import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useCallback, useEffect, useMemo, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Check, GraduationCap, X } from "lucide-react-native";

import { router } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import {
    approveAdmission,
    getAdmissionsByTeacher,
    rejectAdmission,
} from "@/services/admissions";

export default function AdmissionsScreen() {
  const { teacher } = useAuthStore();

  const [admissions, setAdmissions] = useState<any[]>([]);

  const [loadingId, setLoadingId] = useState("");

  const loadAdmissions = useCallback(async () => {
    if (!teacher?.id) return;

    const response = await getAdmissionsByTeacher(teacher.id);

    if (response.success) {
      setAdmissions(response.data || []);
    }
  }, [teacher]);

  useEffect(() => {
    loadAdmissions();
  }, [loadAdmissions]);

  const pendingCount = useMemo(() => {
    return admissions.filter((item) => item.status === "pending").length;
  }, [admissions]);

  const approvedCount = useMemo(() => {
    return admissions.filter((item) => item.status === "approved").length;
  }, [admissions]);

  async function handleApprove(admission: any) {
    try {
      setLoadingId(admission.id);

      const response = await approveAdmission({
        admission,
      });

      if (!response.success) {
        Alert.alert("Error", response.error?.message || "Approval failed.");

        return;
      }

      await loadAdmissions();

      Alert.alert("Approved", "Student admitted successfully.");
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoadingId("");
    }
  }

  async function handleReject(admissionId: string) {
    try {
      setLoadingId(admissionId);

      const response = await rejectAdmission({
        admissionId,
      });

      if (!response.success) {
        Alert.alert("Error", response.error?.message || "Rejection failed.");

        return;
      }

      await loadAdmissions();

      Alert.alert("Rejected", "Admission request rejected.");
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoadingId("");
    }
  }

  console.log(teacher?.id);

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
                Admissions
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
              value={`${admissions.length}`}
              bg="#EEF2FF"
              color="#4F46E5"
            />

            <StatCard
              title="Pending"
              value={`${pendingCount}`}
              bg="#FFF7ED"
              color="#D97706"
            />

            <StatCard
              title="Approved"
              value={`${approvedCount}`}
              bg="#ECFDF5"
              color="#059669"
            />
          </View>

          {/* LIST */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 24,
            }}>
            {admissions.length === 0 ? (
              <EmptyState />
            ) : (
              admissions.map((admission, index) => (
                <AdmissionCard
                  key={index}
                  admission={admission}
                  loading={loadingId === admission.id}
                  onApprove={() => handleApprove(admission)}
                  onReject={() => handleReject(admission.id)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function AdmissionCard({
  admission,
  loading,
  onApprove,
  onReject,
}: {
  admission: any;

  loading: boolean;

  onApprove: () => void;

  onReject: () => void;
}) {
  const approved = admission.status === "approved";

  const rejected = admission.status === "rejected";

  return (
    <View
      style={{
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      {/* TOP */}
      <View
        style={{
          flexDirection: "row",
        }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            backgroundColor: "#EEF2FF",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 14,
          }}>
          <GraduationCap size={24} color="#4F46E5" />
        </View>

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: "800",
                color: "#111827",
              }}>
              {admission.student_name}
            </Text>

            <View
              style={{
                backgroundColor: approved
                  ? "#DCFCE7"
                  : rejected
                    ? "#FEE2E2"
                    : "#FEF3C7",

                paddingHorizontal: 10,

                paddingVertical: 5,

                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: approved
                    ? "#059669"
                    : rejected
                      ? "#DC2626"
                      : "#D97706",
                  textTransform: "capitalize",
                }}>
                {admission.status}
              </Text>
            </View>
          </View>

          <Text
            style={{
              marginTop: 5,
              fontSize: 13,
              color: "#667085",
            }}>
            Class {admission.class_name} • {admission.batch_name}
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 12,
              color: "#98A2B3",
            }}>
            {admission.batch_category} • {admission.phone}
          </Text>
        </View>
      </View>

      {/* INFO */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
        }}>
        <InfoBox title="Year" value={admission.year || "-"} />

        <InfoBox title="School" value={admission.school_name || "-"} />

        <InfoBox title="Source" value={admission.source || "App"} />
      </View>

      {/* ACTIONS */}
      {!approved && !rejected && (
        <View
          style={{
            flexDirection: "row",
            marginTop: 18,
            gap: 10,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={loading}
            onPress={onApprove}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 14,
              backgroundColor: "#059669",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Check size={18} color="#FFF" />

            <Text
              style={{
                marginLeft: 8,
                color: "#FFF",
                fontSize: 14,
                fontWeight: "700",
              }}>
              Approve
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            disabled={loading}
            onPress={onReject}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 14,
              backgroundColor: "#FEE2E2",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <X size={18} color="#DC2626" />

            <Text
              style={{
                marginLeft: 8,
                color: "#DC2626",
                fontSize: 14,
                fontWeight: "700",
              }}>
              Reject
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
          fontSize: 11,
          color: "#98A2B3",
        }}>
        {title}
      </Text>

      <Text
        numberOfLines={1}
        style={{
          marginTop: 4,
          fontSize: 13,
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
          fontWeight: "700",
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

function EmptyState() {
  return (
    <View
      style={{
        backgroundColor: "#FFF",
        borderRadius: 28,
        padding: 34,
        alignItems: "center",
      }}>
      <GraduationCap size={44} color="#98A2B3" />

      <Text
        style={{
          marginTop: 16,
          fontSize: 17,
          fontWeight: "800",
          color: "#111827",
        }}>
        No Admission Requests
      </Text>

      <Text
        style={{
          marginTop: 8,
          fontSize: 13,
          color: "#667085",
          textAlign: "center",
          lineHeight: 20,
        }}>
        New admission requests will appear here.
      </Text>
    </View>
  );
}
