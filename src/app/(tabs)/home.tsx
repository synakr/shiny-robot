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
  Wallet,
} from "lucide-react-native";

import FeatureCard from "@/components/FeatureCard";
import { greeting, greetingStarters, softBgColors } from "@/services/greeting";
import { getAnnouncementsForStudent } from "@/services/student-announcements";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";

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
  const { student } = useAuthStore();

  // jee, neet, foundation based greeting
  const arr =
    student?.batch_category === "JEE"
      ? greeting.jee
      : student?.batch_category === "NEET"
        ? greeting.neet
        : greeting.foundation;

  const greetingText = arr[Math.floor(Math.random() * arr.length)];

  const [announcement, setAnnouncement] = useState<any>(null);
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

  const bgColor = softBgColors[Math.floor(Math.random() * softBgColors.length)];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 200,
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
                {
                  greetingStarters[
                    Math.floor(Math.random() * greetingStarters.length)
                  ]
                }{" "}
                {student?.student_name}, 👋
              </Text>

              <Text
                style={{
                  marginTop: 10,
                  fontSize: 15,
                  lineHeight: 24,
                  color: "#374151",
                }}>
                {"\t" + greetingText}
              </Text>

              {/* <Text
                style={{
                  marginTop: 18,
                  fontSize: 13,
                  lineHeight: 22,
                  color: "#374151",
                  fontStyle: "italic",
                }}>
                {quote || "Kosish karne walo ki kabhi haar nahi hoti!"}
              </Text> */}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                marginTop: 0,
                width: 42,
                height: 42,
                borderRadius: 999,
                backgroundColor: "#D7EDF5",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Bell size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Illustration + Quote */}
          <View
            style={{
              marginTop: 26,
              height: 120,
              borderRadius: 24,
              backgroundColor: bgColor,
              overflow: "hidden",
              paddingHorizontal: 18,
              paddingVertical: 16,
              justifyContent: "space-between",
            }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                letterSpacing: 0.3,
                color: "#0F172A",
                textTransform: "uppercase",
              }}>
              ⭐ Quote of the Day
            </Text>

            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                lineHeight: 22,
                color: "#374151",
                fontStyle: "italic",
              }}>
              {quote || "Kosish karne walo ki kabhi haar nahi hoti!"}
            </Text>
          </View>
        </View>

        {/* ANNOUNCEMENT */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: -28,
            backgroundColor: "#FFF",
            borderRadius: 22,
            padding: 16,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2,
          }}>
          {/* TOP */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
            }}>
            {/* ICON */}
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 15,
                backgroundColor: "#EEE8FF",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}>
              <Notebook size={22} color="#6C63FF" />
            </View>

            {/* CONTENT */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/announcement-details")}
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}>
                <View
                  style={{
                    flex: 1,
                    paddingRight: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "800",
                      color: "#111827",
                    }}>
                    {announcement ? announcement.title : "No Announcements"}
                  </Text>

                  {announcement && (
                    <Text
                      style={{
                        marginTop: 3,
                        fontSize: 12,
                        color: "#98A2B3",
                        fontWeight: "600",
                      }}>
                      {formatAnnouncementDate(announcement.created_at)}
                    </Text>
                  )}
                </View>

                <Text
                  style={{
                    color: "#6C63FF",
                    fontSize: 13,
                    fontWeight: "700",
                  }}>
                  View
                </Text>
              </View>

              {/* MESSAGE */}
              <Text
                numberOfLines={4}
                style={{
                  marginTop: 8,
                  fontSize: 13.5,
                  lineHeight: 21,
                  color: "#4B5563",
                }}>
                {announcement
                  ? announcement.message
                  : "Announcements from your teacher will appear here."}
              </Text>
            </TouchableOpacity>
          </View>
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
            ⭐ Quote of the Day
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
function formatAnnouncementDate(dateString: string) {
  return new Date(dateString).toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}
