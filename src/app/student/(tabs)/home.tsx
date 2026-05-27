import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import {
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileText,
  Notebook,
  PlaySquareIcon,
  Trophy,
  Wallet,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FeatureCard from "@/components/FeatureCard";

import { greeting, greetingStarters } from "@/services/greeting";
import { getAnnouncementsForStudent } from "@/services/student-announcements";

import { useAuthStore } from "@/store/authStore";

import { router } from "expo-router";

import { useEffect, useMemo, useState } from "react";

const features = [
  {
    title: "Watch Videos",
    subtitle: "Continue",
    icon: PlaySquareIcon,
    color: "#DC2626",
    route: "/student/videos" as const,
  },
  {
    title: "Courses",
    subtitle: "Continue Learning",
    icon: BookOpen,
    color: "#4F46E5",
    route: "/student/courses" as const,
  },

  {
    title: "Notes",
    subtitle: "Latest Notes",
    icon: FileText,
    color: "#969105",
    route: "/student/app-test" as const,
  },

  {
    title: "Tasks / DPP",
    subtitle: "Pending Tasks",
    icon: ClipboardList,
    color: "#D97706",
    route: "/student/(tabs)/tasks" as const,
  },

  {
    title: "Payment",
    subtitle: "Fee Status",
    icon: Wallet,
    color: "#059669",
    route: "/student/home" as const,
  },

  {
    title: "Performance",
    subtitle: "View Stats",
    icon: BarChart3,
    color: "#7C3AED",
    route: "/student/home" as const,
  },
];

export default function HomeScreen() {
  const { student } = useAuthStore();

  const [announcement, setAnnouncement] = useState<any>(null);

  const [quote, setQuote] = useState("");

  const arr =
    student?.batch_category === "JEE"
      ? greeting.jee
      : student?.batch_category === "NEET"
        ? greeting.neet
        : greeting.foundation;

  const greetingText = arr[Math.floor(Math.random() * arr.length)];

  useEffect(() => {
    async function loadAnnouncement() {
      if (!student) return;

      const response = await getAnnouncementsForStudent(student);

      if (response.success && response.data?.length) {
        setAnnouncement(response.data[0]);
      }
    }

    loadAnnouncement();
  }, [student]);

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

  const isNewAnnouncement = useMemo(() => {
    if (!announcement) return false;

    const created = new Date(announcement.created_at);

    const now = new Date();

    const diff = now.getTime() - created.getTime();

    return diff < 24 * 60 * 60 * 1000;
  }, [announcement]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 140,
        }}>
        {/* HERO */}
        <LinearGradient
          colors={["#ECECFA", "#E4E5F8", "#F8F8F8"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 0,
            y: 1,
          }}
          style={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 82,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}>
          {/* TOP */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <View />

            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                backgroundColor: "#FFFFFF",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Bell size={18} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* HERO TEXT */}
          <View
            style={{
              marginTop: 14,
            }}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "800",
                color: "#111827",
                letterSpacing: -0.5,
                lineHeight: 31,
              }}>
              {
                greetingStarters[
                  Math.floor(Math.random() * greetingStarters.length)
                ]
              }{" "}
              {student?.student_name}, 👋
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontSize: 12.5,
                lineHeight: 20,
                color: "#4B5563",
              }}>
              {"\t" + greetingText}
            </Text>

            {/* CHIPS */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 14,
                gap: 8,
                flexWrap: "wrap",
              }}>
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  paddingHorizontal: 13,
                  paddingVertical: 7,
                  borderRadius: 10,
                  borderLeftWidth: 3,
                  borderLeftColor: "#4F46E5",
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: "#4F46E5",
                  }}>
                  {student?.batch_name} • {student?.batch_category} •{" "}
                  {student?.year}
                </Text>
              </View>
            </View>
          </View>

          {/* QUOTE CARD */}
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
        </LinearGradient>

        {/* STATS */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            marginTop: -48,
            gap: 10,
          }}>
          <StudentStatCard
            icon={CheckCircle2}
            title="Attendance"
            value="92%"
            subtitle="This Month"
            color="#10B981"
            bg="#FFFFFF"
          />

          <StudentStatCard
            icon={Trophy}
            title="Rank"
            value="12"
            subtitle="Batch Rank"
            color="#6366F1"
            bg="#FFFFFF"
          />

          <StudentStatCard
            icon={ClipboardList}
            title="Tasks"
            value="3"
            subtitle="Pending"
            color="#F59E0B"
            bg="#FFFFFF"
          />
        </View>

        {/* ANNOUNCEMENT */}
        <SectionTitle title="Announcement" />

        <View
          style={{
            marginHorizontal: 16,
            marginTop: 14,
            backgroundColor: "#FFF",
            borderRadius: 18,
            padding: 13,

            shadowColor: "#000",
            shadowOpacity: 0.02,
            shadowRadius: 5,
            elevation: 2,
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
            }}>
            {/* ICON */}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: "#EEF2FF",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}>
              <Notebook size={18} color="#4F46E5" />
            </View>

            {/* CONTENT */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/student/announcement-details")}
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    fontSize: 13.5,
                    fontWeight: "800",
                    color: "#111827",
                  }}>
                  {announcement ? announcement.title : "No Announcements"}
                </Text>

                {isNewAnnouncement && (
                  <View
                    style={{
                      marginLeft: 6,
                      backgroundColor: "#FEE2E2",
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      borderRadius: 999,
                    }}>
                    <Text
                      style={{
                        fontSize: 8.5,
                        fontWeight: "800",
                        color: "#DC2626",
                      }}>
                      NEW
                    </Text>
                  </View>
                )}
              </View>

              {announcement && (
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 10.5,
                    color: "#9CA3AF",
                    fontWeight: "600",
                  }}>
                  {formatAnnouncementDate(announcement.created_at)}
                </Text>
              )}

              <Text
                numberOfLines={2}
                style={{
                  marginTop: 7,
                  fontSize: 12.5,
                  lineHeight: 19,
                  color: "#4B5563",
                  fontStyle: "italic",
                }}>
                {announcement
                  ? announcement.message
                  : "Announcements from your teacher will appear here."}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* QUICK ACCESS */}
        <SectionTitle title="Quick Access" />

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            marginTop: 14,
            gap: 10,
          }}>
          {features.map((item, index) => (
            <FeatureCard
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              color={item.color}
              onPress={() => router.push(item.route)}
            />
          ))}
        </View>

        {/* FOOTER QUOTE */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 34,
            paddingVertical: 14,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Text
            style={{
              fontSize: 13,
              lineHeight: 22,
              color: "#6B7280",
              textAlign: "center",
              fontStyle: "italic",
              fontWeight: "500",
            }}>
            Discipline today, success tomorrow.
            {"\n"}– Keep going!
          </Text>
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
        fontSize: 17,
        fontWeight: "800",
        color: "#111827",
      }}>
      {title}
    </Text>
  );
}

function StudentStatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  bg,
}: any) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg,
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 10,
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 3,
      }}>
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 11,
          backgroundColor: `${color}14`,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Icon size={16} color={color} />
      </View>

      <Text
        style={{
          marginTop: 9,
          fontSize: 20,
          fontWeight: "800",
          color: "#111827",
          letterSpacing: -0.5,
        }}>
        {value}
      </Text>

      <Text
        numberOfLines={1}
        style={{
          marginTop: 4,
          fontSize: 11.5,
          fontWeight: "700",
          color: "#374151",
        }}>
        {title}
      </Text>

      <Text
        numberOfLines={1}
        style={{
          marginTop: 2,
          fontSize: 10,
          color: "#9CA3AF",
        }}>
        {subtitle}
      </Text>
    </View>
  );
}

function formatAnnouncementDate(dateString: string) {
  return new Date(dateString).toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}
