import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  BarChart3,
  Bell,
  BookOpen,
  ClipboardList,
  FileText,
  Notebook,
  PlayCircle,
  Wallet
} from "lucide-react-native";

import FeatureCard from "@/components/FeatureCard";

const features = [
  {
    title: "Courses",
    subtitle: "2 New",
    icon: BookOpen,
    color: "#6C63FF",
  },
  {
    title: "Notes",
    subtitle: "12 New",
    icon: FileText,
    color: "#22C55E",
  },
  {
    title: "Tasks / DPP",
    subtitle: "3 Pending",
    icon: ClipboardList,
    color: "#F59E0B",
  },
  {
    title: "Payment",
    subtitle: "Pending",
    icon: Wallet,
    color: "#EF4444",
  },
  {
    title: "Watch Videos",
    subtitle: "Continue Learning",
    icon: PlayCircle,
    color: "#FF5A5F",
  },
  {
    title: "Performance",
    subtitle: "View Stats",
    icon: BarChart3,
    color: "#3B82F6",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}>
        {/* HERO */}
        <View
          style={{
            backgroundColor: "#EAF3F6",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 32,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}>
            <View>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Hey Sayan! 👋
              </Text>

              <Text
                style={{
                  marginTop: 10,
                  fontSize: 15,
                  lineHeight: 24,
                  color: "#374151",
                }}>
                Stay consistent today,{"\n"}
                Success is built daily.
              </Text>
            </View>

            <TouchableOpacity
              style={{
                marginTop: 4,
              }}>
              <Bell size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Illustration */}
          <View
            style={{
              marginTop: 28,
              height: 120,
              borderRadius: 22,
              backgroundColor: "#D7EDF5",
            }}
          />
        </View>

        {/* ANNOUNCEMENT */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: -34,
            backgroundColor: "#FFF",
            borderRadius: 22,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 3,
          }}>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              alignItems: "center",
            }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: "#EEE8FF",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 14,
              }}>
              <Notebook size={24} color="#6C63FF" />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#111827",
                }}>
                New Announcement
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  color: "#4B5563",
                }}>
                Weekly test on Sunday.
              </Text>

              <Text
                style={{
                  marginTop: 2,
                  fontSize: 13,
                  color: "#4B5563",
                }}>
                Syllabus: Chapter 1–4
              </Text>
            </View>
          </View>

          <TouchableOpacity>
            <Text
              style={{
                color: "#6C63FF",
                fontSize: 14,
                fontWeight: "600",
              }}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {/* GRID */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            marginTop: 18,
          }}>
          {features.map((item, index) => (
            <FeatureCard
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              color={item.color}
            />
          ))}
        </View>

        {/* QUOTE */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 4,
            backgroundColor: "#FFF7E8",
            borderRadius: 22,
            padding: 16,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#111827",
            }}>
            ⭐ Motivational Quote
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 14,
              lineHeight: 22,
              color: "#374151",
            }}>
            Discipline today, success tomorrow.{"\n"}– Keep going!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
