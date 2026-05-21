import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  SlidersHorizontal
} from "lucide-react-native";

import TaskCard from "@/components/TaskCard";

export default function TasksScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 180,
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
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
              <TouchableOpacity>
                <ArrowLeft size={28} color="#111827" />
              </TouchableOpacity>

              <Text
                style={{
                  marginLeft: 14,
                  fontSize: 30,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Tasks / DPP
              </Text>
            </View>

            <TouchableOpacity>
              <SlidersHorizontal size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        {/* TOP FILTERS */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 28,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
          }}>
          <TopTab label="All" active />

          <TopTab label="Pending" count="3" />

          <TopTab label="Completed" />
        </View>

        {/* TODAY */}
        <SectionTitle title="Today" />

        <View style={{ paddingHorizontal: 20 }}>
          <TaskCard
            title="DPP - Algebra"
            questions="10 Questions"
            due="Due: Today, 11:59 PM"
            status="Pending"
            statusColor="#D97706"
            statusBg="#FEF3C7"
          />
        </View>

        {/* TOMORROW */}
        <SectionTitle title="Tomorrow" />

        <View style={{ paddingHorizontal: 20 }}>
          <TaskCard
            title="DPP - Trigonometry"
            questions="15 Questions"
            due="Due: Tomorrow, 11:59 PM"
            status="Pending"
            statusColor="#D97706"
            statusBg="#FEF3C7"
          />
        </View>

        {/* UPCOMING */}
        <SectionTitle title="Upcoming" />

        <View style={{ paddingHorizontal: 20 }}>
          <TaskCard
            title="DPP - Calculus"
            questions="20 Questions"
            due="Due: 5 May, 11:59 PM"
            status="Upcoming"
            statusColor="#667085"
            statusBg="#F2F4F7"
          />

          <TaskCard
            title="DPP - Vector 3D"
            questions="12 Questions"
            due="Due: 6 May, 11:59 PM"
            status="Upcoming"
            statusColor="#667085"
            statusBg="#F2F4F7"
          />
        </View>

        {/* COMPLETED */}
        <SectionTitle title="Completed" />

        <View style={{ paddingHorizontal: 20 }}>
          <TaskCard
            title="DPP - Limits"
            questions="10 Questions"
            due="Completed on 1 May 2024"
            status="Completed"
            statusColor="#10B981"
            statusBg="#DCFCE7"
            completed
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
        marginTop: 26,
        marginBottom: 2,
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
      }}>
      {title}
    </Text>
  );
}

function TopTab({
  label,
  active,
  count,
}: {
  label: string;
  active?: boolean;
  count?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingBottom: 14,
        borderBottomWidth: active ? 3 : 0,
        borderBottomColor: "#6C63FF",
        flexDirection: "row",
        justifyContent: "center",
      }}>
      <Text
        style={{
          color: active ? "#6C63FF" : "#667085",
          fontSize: 16,
          fontWeight: active ? "700" : "600",
        }}>
        {label}
      </Text>

      {count && (
        <View
          style={{
            marginLeft: 8,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: "#FEF3C7",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text
            style={{
              color: "#D97706",
              fontSize: 13,
              fontWeight: "700",
            }}>
            {count}
          </Text>
        </View>
      )}
    </View>
  );
}
