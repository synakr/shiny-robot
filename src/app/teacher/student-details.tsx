import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    ArrowLeft,
    CalendarCheck,
    CheckSquare,
    FileText,
    IndianRupee,
    MessageCircle,
    Phone,
    TrendingUp,
    Wallet,
} from "lucide-react-native";

import ActionGridButton from "@/components/ActionGridButton";
import DetailStatCard from "@/components/DetailStatCard";
import SubjectProgress from "@/components/SubjectProgress";

export default function StudentDetailsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
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
            <TouchableOpacity>
              <ArrowLeft size={24} color="#111827" />
            </TouchableOpacity>

            <Text
              style={{
                marginLeft: 14,
                fontSize: 26,
                fontWeight: "800",
                color: "#111827",
              }}>
              Student Details
            </Text>
          </View>
        </View>

        {/* PROFILE CARD */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 22,
            backgroundColor: "#FFF",
            borderRadius: 24,
            padding: 18,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 6,
            elevation: 2,
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            {/* Avatar */}
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 24,
                backgroundColor: "#EEE8FF",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "800",
                  color: "#6C63FF",
                }}>
                A
              </Text>
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Aarav Sharma
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 14,
                  color: "#667085",
                }}>
                Class 11 • Batch A
              </Text>

              <View
                style={{
                  marginTop: 10,
                  alignSelf: "flex-start",
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
                  Fees Paid
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* QUICK STATS */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            marginTop: 22,
          }}>
          <DetailStatCard
            title="Attendance"
            value="92%"
            color="#10B981"
            bg="#DCFCE7"
          />

          <DetailStatCard
            title="Tasks"
            value="12/15"
            color="#F59E0B"
            bg="#FEF3C7"
          />

          <DetailStatCard
            title="Fees"
            value="Paid"
            color="#6C63FF"
            bg="#EEE8FF"
          />
        </View>

        {/* ACTIONS */}
        <SectionTitle title="Quick Actions" />

        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 14,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}>
          <ActionGridButton
            icon={Phone}
            label="Call Student"
            color="#10B981"
            bg="#DCFCE7"
          />

          <ActionGridButton
            icon={MessageCircle}
            label="Send Message"
            color="#2563EB"
            bg="#DBEAFE"
          />

          <ActionGridButton
            icon={IndianRupee}
            label="Mark Payment"
            color="#F59E0B"
            bg="#FEF3C7"
          />

          <ActionGridButton
            icon={CheckSquare}
            label="Assign Task"
            color="#6C63FF"
            bg="#EEE8FF"
          />
        </View>

        {/* RECENT ACTIVITY */}
        <SectionTitle title="Recent Activity" />

        <View
          style={{
            marginHorizontal: 20,
            marginTop: 14,
            backgroundColor: "#FFF",
            borderRadius: 22,
            paddingHorizontal: 16,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 6,
            elevation: 2,
          }}>
          <ActivityRow
            icon={CalendarCheck}
            title="Attendance marked present"
            subtitle="Today • 9:00 AM"
            color="#10B981"
            bg="#DCFCE7"
          />

          <Divider />

          <ActivityRow
            icon={Wallet}
            title="Monthly fee payment received"
            subtitle="1 May 2024"
            color="#F59E0B"
            bg="#FEF3C7"
          />

          <Divider />

          <ActivityRow
            icon={FileText}
            title="Submitted DPP - Algebra"
            subtitle="30 Apr 2024"
            color="#2563EB"
            bg="#DBEAFE"
          />
        </View>

        {/* PERFORMANCE */}
        <SectionTitle title="Performance Overview" />

        <View
          style={{
            marginHorizontal: 20,
            marginTop: 14,
            backgroundColor: "#FFF",
            borderRadius: 22,
            padding: 18,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 6,
            elevation: 2,
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 18,
            }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                backgroundColor: "#EEE8FF",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}>
              <TrendingUp size={20} color="#6C63FF" />
            </View>

            <View>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "700",
                  color: "#111827",
                }}>
                Overall Progress
              </Text>

              <Text
                style={{
                  marginTop: 2,
                  fontSize: 13,
                  color: "#667085",
                }}>
                Last 30 days performance
              </Text>
            </View>
          </View>

          <SubjectProgress subject="Physics" progress={88} color="#6C63FF" />

          <SubjectProgress subject="Chemistry" progress={76} color="#10B981" />

          <SubjectProgress
            subject="Mathematics"
            progress={91}
            color="#F59E0B"
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
        marginTop: 24,
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

function ActivityRow({
  icon: Icon,
  title,
  subtitle,
  color,
  bg,
}: {
  icon: any;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
      }}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 14,
        }}>
        <Icon size={20} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#111827",
          }}>
          {title}
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 12,
            color: "#667085",
          }}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
