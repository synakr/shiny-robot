import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  Archive,
  Bell,
  CheckSquare,
  CreditCard,
  FileText,
  ListTodo,
  Megaphone,
  Rocket,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react-native";

import ActivityItem from "@/components/ActivityItems";
import QuickActionCard from "@/components/QuickActionCard";
import TeacherStatCard from "@/components/TeacherStatCard";
import { useAuthStore } from "@/store/authStore";

export default function TeacherDashboardScreen() {
  const { teacher } = useAuthStore();

  console.log(teacher);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 210,
        }}>
        {/* HERO */}
        <View
          style={{
            backgroundColor: "#E9D8FD",
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
            <View />

            <TouchableOpacity>
              <Bell size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* HERO TEXT */}
          <View
            style={{
              marginTop: 28,
            }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "800",
                color: "#111827",
              }}>
              Welcome, {teacher?.teacher_name || "Teacher"}! 👋
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontSize: 14,
                color: "#4B5563",
              }}>
              {teacher?.institute_name || "Manage your classes easily."}
            </Text>
          </View>
        </View>

        {/* STATS */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 14,
            marginTop: -56,
          }}>
          <TeacherStatCard
            icon={Users}
            title="Students"
            value="248"
            subtitle="+12 this week"
            color="#10B981"
            bg="#EEE8FF"
          />

          <TeacherStatCard
            icon={Wallet}
            title="Pending"
            value="18"
            subtitle="₹ 45,000"
            color="#F59E0B"
            bg="#FEF3C7"
          />

          <TeacherStatCard
            icon={UserCheck}
            title="Batches"
            value="6"
            subtitle="Running"
            color="#10B981"
            bg="#DCFCE7"
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
            icon={Users}
            title="View Students"
            color="#6C63FF"
            bg="#EEE8FF"
            onPress={() => router.push("/teacher/students")}
          />

          <QuickActionCard
            icon={Megaphone}
            title="Send Announcement"
            color="#F59E0B"
            bg="#FEF3C7"
            onPress={() => router.push("/teacher/create-announcement")}
          />

          <QuickActionCard
            icon={FileText}
            title="Share Notes"
            color="#10B981"
            bg="#DCFCE7"
          />

          <QuickActionCard
            icon={CheckSquare}
            title="Create Task / DPP"
            color="#2563EB"
            bg="#DBEAFE"
            onPress={() => router.push("/teacher/create-task")}
          />

          <QuickActionCard
            icon={CreditCard}
            title="Payment Update"
            color="#EF4444"
            bg="#FFE4E6"
          />

          <QuickActionCard
            icon={Rocket}
            title="Launch Course"
            color="#8B5CF6"
            bg="#F3E8FF"
          />

          <QuickActionCard
            icon={Archive}
            title="Saved Tasks"
            color="#F59E0B"
            bg="#FEF3C7"
            onPress={() => router.push("/teacher/tasks")}
          />

          <QuickActionCard
            icon={ListTodo}
            title="Announcements"
            color="#10B981"
            bg="#DCFCE7"
            onPress={() => router.push("/teacher/announcements")}
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
