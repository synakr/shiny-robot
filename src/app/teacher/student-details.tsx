import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router, useLocalSearchParams } from "expo-router";

import {
  ArrowLeft,
  CalendarCheck,
  CheckSquare,
  FileText,
  IndianRupee,
  Mail,
  MessageCircle,
  Phone,
  TrendingUp,
  Trophy,
  UserSquare2,
  Wallet,
} from "lucide-react-native";

import ActionGridButton from "@/components/ActionGridButton";

import DetailStatCard from "@/components/DetailStatCard";

import SubjectProgress from "@/components/SubjectProgress";

export default function StudentDetailsScreen() {
  const params = useLocalSearchParams();

  const studentName = (params.name as string) || "Student";

  const className = (params.className as string) || "Class";

  const batch = (params.batch as string) || "Batch";

  const batchId = (params.batchId as string) || "Batch ID";

  const phone = (params.phone as string) || "Not Available";

  const email = (params.email as string) || "No Email";

  const attendance = (params.attendance as string) || "0";

  const tasks = (params.tasks as string) || "0";

  const performance = (params.performance as string) || "0";

  const rank = (params.rank as string) || "-";

  const paymentStatus = (params.payment as string) || "Pending";

  const paid = paymentStatus === "Paid";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
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
            <TouchableOpacity onPress={() => router.back()}>
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
            borderRadius: 28,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 6,
            elevation: 2,
          }}>
          <View
            style={{
              flexDirection: "row",
            }}>
            {/* AVATAR */}
            <View
              style={{
                width: 78,
                height: 78,
                borderRadius: 26,
                backgroundColor: "#EEE8FF",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "800",
                  color: "#6C63FF",
                }}>
                {studentName.charAt(0)}
              </Text>
            </View>

            {/* INFO */}
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                {studentName}
              </Text>

              <Text
                style={{
                  marginTop: 5,
                  fontSize: 14,
                  color: "#667085",
                }}>
                Class {className} • {batch}
              </Text>

              <Text
                style={{
                  marginTop: 5,
                  fontSize: 12,
                  color: "#98A2B3",
                }}>
                {batchId}
              </Text>

              {/* BADGES */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  gap: 10,
                }}>
                <View
                  style={{
                    backgroundColor: paid ? "#DCFCE7" : "#FEF3C7",

                    paddingHorizontal: 12,

                    paddingVertical: 6,

                    borderRadius: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: paid ? "#10B981" : "#D97706",
                    }}>
                    {paymentStatus}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#FEF3C7",

                    paddingHorizontal: 12,

                    paddingVertical: 6,

                    borderRadius: 12,

                    flexDirection: "row",

                    alignItems: "center",
                  }}>
                  <Trophy size={13} color="#F59E0B" />

                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: 12,
                      fontWeight: "700",
                      color: "#D97706",
                    }}>
                    Rank #{rank}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* CONTACT INFO */}
          <View
            style={{
              marginTop: 22,
              borderTopWidth: 1,
              borderTopColor: "#F1F5F9",
              paddingTop: 18,
              gap: 14,
            }}>
            <InfoRow icon={Phone} label="Phone" value={phone} />

            <InfoRow icon={Mail} label="Email" value={email} />

            <InfoRow
              icon={UserSquare2}
              label="Enrollment ID"
              value={(params.enrollmentId as string) || "Not Available"}
            />
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
            value={`${attendance}%`}
            color="#10B981"
            bg="#DCFCE7"
          />

          <DetailStatCard
            title="Tasks"
            value={`${tasks}`}
            color="#F59E0B"
            bg="#FEF3C7"
          />

          <DetailStatCard
            title="Score"
            value={`${performance}`}
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
            subtitle="1 May 2026"
            color="#F59E0B"
            bg="#FEF3C7"
          />

          <Divider />

          <ActivityRow
            icon={FileText}
            title="Submitted Assignment"
            subtitle="30 Apr 2026"
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
                Academic Insights
              </Text>

              <Text
                style={{
                  marginTop: 2,
                  fontSize: 13,
                  color: "#667085",
                }}>
                AI-powered student progress snapshot
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

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: "#F3F4F6",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}>
        <Icon size={16} color="#667085" />
      </View>

      <View>
        <Text
          style={{
            fontSize: 12,
            color: "#98A2B3",
          }}>
          {label}
        </Text>

        <Text
          style={{
            marginTop: 2,
            fontSize: 14,
            fontWeight: "600",
            color: "#111827",
          }}>
          {value}
        </Text>
      </View>
    </View>
  );
}
