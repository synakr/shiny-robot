import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  Bell,
  BookOpen,
  CheckSquare,
  CircleHelp,
  CreditCard,
  Gift,
  Info,
  MessageCircle,
  Settings,
  Shield,
  Trophy,
  User,
} from "lucide-react-native";

import ProfileMenuItem from "@/components/ProfileMenuItem";
import StatCard from "@/components/StatCard";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
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
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: "#111827",
              }}>
              Profile
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 16,
              }}>
              <TouchableOpacity>
                <Bell size={24} color="#4B5563" />
              </TouchableOpacity>

              <TouchableOpacity>
                <Settings size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* PROFILE CARD */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 24,
            backgroundColor: "#F4F0FF",
            borderRadius: 28,
            padding: 16,
          }}>
          {/* TOP */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            {/* Avatar */}
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "#DDD6FE",
                marginRight: 16,
              }}
            />

            {/* User Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Sayan
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 14,
                  color: "#667085",
                }}>
                sayan@email.com
              </Text>

              <View
                style={{
                  marginTop: 10,
                  alignSelf: "flex-start",
                  backgroundColor: "#EEE8FF",
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 14,
                }}>
                <Text
                  style={{
                    color: "#6C63FF",
                    fontWeight: "700",
                    fontSize: 13,
                  }}>
                  🎓 Class 11
                </Text>
              </View>
            </View>
          </View>

          {/* DIVIDER */}
          <View
            style={{
              height: 1,
              backgroundColor: "#E5E7EB",
              marginVertical: 20,
            }}
          />

          {/* STATS */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
            <StatCard
              icon={BookOpen}
              value="12"
              label="Courses"
              color="#6C63FF"
              bg="#EEE8FF"
            />

            <StatCard
              icon={CheckSquare}
              value="48"
              label="Tasks"
              color="#F59E0B"
              bg="#FEF3C7"
            />

            <StatCard
              icon={Trophy}
              value="85%"
              label="Progress"
              color="#10B981"
              bg="#DCFCE7"
            />
          </View>
        </View>

        {/* STUDY OVERVIEW */}
        <SectionTitle title="Study Overview" />

        <View
          style={{
            marginHorizontal: 20,
            marginTop: 14,
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
            {/* Streak Circle */}
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                borderWidth: 8,
                borderColor: "#6C63FF",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 18,
              }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                7
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: "#667085",
                }}>
                Days
              </Text>
            </View>

            {/* Text */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#111827",
                }}>
                Current Streak 🔥
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  lineHeight: 22,
                  color: "#667085",
                }}>
                You’re on fire! Keep it up.
              </Text>
            </View>
          </View>
        </View>

        {/* ACCOUNT */}
        <SectionTitle title="Account" />

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
          <ProfileMenuItem
            icon={User}
            title="Personal Information"
            color="#6C63FF"
            bg="#EEE8FF"
          />

          <Divider />

          <ProfileMenuItem
            icon={Shield}
            title="Security"
            color="#3B82F6"
            bg="#DBEAFE"
          />

          <Divider />

          <ProfileMenuItem
            icon={CreditCard}
            title="Payment Methods"
            color="#10B981"
            bg="#DCFCE7"
          />

          <Divider />

          <ProfileMenuItem
            icon={Gift}
            title="Refer & Earn"
            color="#F97316"
            bg="#FFEDD5"
          />
        </View>

        {/* SUPPORT */}
        <SectionTitle title="Support" />

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
          <ProfileMenuItem
            icon={CircleHelp}
            title="Help & Support"
            color="#8B5CF6"
            bg="#F3E8FF"
          />

          <Divider />

          <ProfileMenuItem
            icon={MessageCircle}
            title="Feedback"
            color="#2563EB"
            bg="#DBEAFE"
          />

          <Divider />

          <ProfileMenuItem
            icon={Info}
            title="About App"
            color="#F43F5E"
            bg="#FFE4E6"
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
        fontSize: 22,
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
