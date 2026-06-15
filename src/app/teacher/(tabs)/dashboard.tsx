import { router } from "expo-router";

import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useMemo, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArchiveRestore,
  Bell,
  BellRing,
  CheckSquare,
  ClipboardCheck,
  CreditCard,
  FileText,
  LogOut,
  GraduationCap,
  Megaphone,
  NotebookPen,
  PenIcon,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react-native";

import ActivityItem from "@/components/ActivityItems";

import QuickActionCard from "@/components/QuickActionCard";

import TeacherStatCard from "@/components/TeacherStatCard";

import { useAuthStore } from "@/store/authStore";

import { getStudentsByTeacher } from "@/services/students";

import { getBatchesByTeacher } from "@/services/batches";

import { supabase } from "@/lib/supabase";

export default function TeacherDashboardScreen() {
  const { teacher } = useAuthStore();

  async function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();

          useAuthStore.getState().logout();

          router.replace("/auth/role-select");
        },
      },
    ]);
  }

  const [students, setStudents] = useState<any[]>([]);

  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      if (!teacher?.id) return;

      const studentsResponse = await getStudentsByTeacher(teacher.id);

      if (studentsResponse.success) {
        setStudents(studentsResponse.data || []);
      }

      const batchesResponse = await getBatchesByTeacher(teacher.id);

      if (batchesResponse.success) {
        setBatches(batchesResponse.data || []);
      }
    }

    loadDashboard();
  }, [teacher]);

  const weeklyStudents = useMemo(() => {
    return students.filter((student) => {
      const created = new Date(student.created_at);

      const now = new Date();

      const diff = now.getTime() - created.getTime();

      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length;
  }, [students]);

  const pendingPayments = useMemo(() => {
    return students.filter((student) => student.payment_status === "Pending")
      .length;
  }, [students]);

  const activeBatches = useMemo(() => {
    return batches.filter((batch) => batch.is_active).length;
  }, [batches]);

  const [quote, setQuote] = useState("");

  useEffect(() => {
    async function loadQuote() {
      try {
        const response = await fetch(
          "https://prem-k-r.github.io/multilingual-quotes-api/data/en.json",
        );

        const data = await response.json();

        const randomQuote = data[Math.floor(Math.random() * data.length)];

        setQuote(`${randomQuote.quote} — ${randomQuote.author}`);
      } catch (error) {
        console.log(error);
      }
    }

    loadQuote();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 210,
        }}>
        {/* HERO */}
        <View
          style={{
            backgroundColor: "#EEF2FF",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 90,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}>
          {/* TOP */}
<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }}>
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={handleLogout}
    style={{
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: "#FFF",
      justifyContent: "center",
      alignItems: "center",
    }}>
    <LogOut size={20} color="#DC2626" />
  </TouchableOpacity>

  <TouchableOpacity>
    <Bell size={22} color="#111827" />
  </TouchableOpacity>
</View>

          {/* HERO TEXT */}
          <View
            style={{
              marginTop: 25,
            }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: "#111827",
              }}>
              {teacher?.institute_name || "Institute"}
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontSize: 15,
                color: "#6B7280",
              }}>
              Welcome back, {teacher?.teacher_name || "Teacher"} Sir
            </Text>

            <View
              style={{
                marginTop: 20,
                borderRadius: 18,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 14,
                paddingVertical: 14,

                borderLeftWidth: 3,
                borderLeftColor: "#4F46E5",
              }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "800",
                  color: "#4F46E5",
                  letterSpacing: 0.5,
                }}>
                QUOTE OF THE DAY
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 12.5,
                  lineHeight: 20,
                  color: "#4B5563",
                  fontStyle: "italic",
                }}>
                {quote || "Discipline today, success tomorrow."}
              </Text>
            </View>
          </View>
        </View>

        {/* STATS */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 14,
            marginTop: -56,
            gap: 12,
          }}>
          {/* STUDENTS */}
          <TeacherStatCard
            icon={Users}
            title="Students"
            value={`${students.length}`}
            subtitle={`+${weeklyStudents} this week`}
            color="#4F46E5"
            bg="#EEF2FF"
          />

          {/* PAYMENTS */}
          <TeacherStatCard
            icon={Wallet}
            title="Pending"
            value={`${pendingPayments}`}
            subtitle={`₹ ${pendingPayments * 2500}`}
            color="#D97706"
            bg="#FFF7ED"
          />

          {/* BATCHES */}
          <TeacherStatCard
            icon={UserCheck}
            title="Batches"
            value={`${activeBatches}`}
            subtitle="Active"
            color="#059669"
            bg="#ECFDF5"
          />
        </View>

        {/* QUICK ACTIONS */}
        <SectionTitle title="Quick Actions" />

        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 12,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 10,
          }}>
          <QuickActionCard
  icon={NotebookPen}
  title="Share Notes"
  color="#059669"
  bg="#D1FAE5"
  onPress={() => router.push("/teacher/src/app/teacher/create-note")}
/>

          <QuickActionCard
            icon={Wallet}
            title="Payment Update"
            color="#E11D48"
            bg="#FFE4E6"
          />

          <QuickActionCard
            icon={ClipboardCheck}
            title="Create Task / DPP"
            color="#2563EB"
            bg="#DBEAFE"
            onPress={() => router.push("/teacher/create-task")}
          />

          <QuickActionCard
            icon={ArchiveRestore}
            title="Saved Tasks"
            color="#7C3AED"
            bg="#F3E8FF"
            onPress={() => router.push("/teacher/tasks")}
          />

          <QuickActionCard
            icon={Megaphone}
            title="Send Announcement"
            color="#D97706"
            bg="#FEF3C7"
            onPress={() => router.push("/teacher/create-announcement")}
          />

          <QuickActionCard
            icon={BellRing}
            title="Announcement"
            color="#0891B2"
            bg="#E0F2FE"
            onPress={() => router.push("/teacher/announcements")}
          />

          <QuickActionCard
            icon={GraduationCap}
            title="Admissions"
            color="#4F46E5"
            bg="#E0E7FF"
            onPress={() => router.push("/teacher/admissions")}
          />

          <QuickActionCard
            icon={PenIcon}
            title="Test"
            color="#e65346"
            bg="#ffdfdf"
            onPress={() => router.push("/teacher/tests")}
          />
        </View>

        {/* ACTIVITIES */}
        <SectionTitle title="Recent Activities" />

        <View
          style={{
            marginHorizontal: 20,
            marginTop: 14,
            backgroundColor: "#FFF",
            borderRadius: 24,
            paddingHorizontal: 18,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 6,
            elevation: 2,
          }}>
          <ActivityItem
            icon={FileText}
            title="New note uploaded in Class 11 - Physics"
            time="2 May 2024, 10:30 AM"
            color="#F59E0B"
            bg="#FEF3C7"
          />

          <Divider />

          <ActivityItem
            icon={CheckSquare}
            title="DPP - Algebra assigned to Class 11"
            time="2 May 2024, 09:15 AM"
            color="#EF4444"
            bg="#FFE4E6"
          />

          <Divider />

          <ActivityItem
            icon={CreditCard}
            title="Payment received from Aarav Sharma"
            time="1 May 2024, 07:45 PM"
            color="#10B981"
            bg="#DCFCE7"
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
        marginTop: 22,
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
      }}>
      {title}
    </Text>
  );
}

function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "#EEF2F6",
      }}
    />
  );
}
