import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Search } from "lucide-react-native";

import CourseCard from "@/components/CourseCard";

const courses = [
  {
    title: "Class 11\nComplete Course",
    subjects: "Physics, Chemistry,\nMaths",
    progress: 45,
    color: "#6C63FF",
    imageBg: "#DCCFFF",
  },
  {
    title: "JEE Foundation\nBatch",
    subjects: "Physics, Chemistry,\nMaths",
    progress: 20,
    color: "#10B981",
    imageBg: "#CFF7F1",
  },
  {
    title: "Crash Course\nFor Board Exams",
    subjects: "Physics, Chemistry,\nMaths",
    progress: 75,
    color: "#F59E0B",
    imageBg: "#FFE0C2",
  },
];

export default function CoursesScreen() {
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
              Courses
            </Text>

            <TouchableOpacity>
              <Search size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        {/* TABS */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 28,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
          }}>
          <TopTab label="All Courses" active />
          <TopTab label="Enrolled" />
          <TopTab label="Purchased" />
        </View>

        {/* COURSES */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 20,
          }}>
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              subjects={course.subjects}
              progress={course.progress}
              color={course.color}
              imageBg={course.imageBg}
            />
          ))}
        </View>

        {/* PAYMENT BUTTON */}
        <TouchableOpacity
          style={{
            marginHorizontal: 20,
            marginTop: 4,
            height: 50,
            borderRadius: 18,
            backgroundColor: "#6C63FF",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text
            style={{
              color: "#FFF",
              fontSize: 16,
              fontWeight: "700",
            }}>
            Make a Payment
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function TopTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingBottom: 14,
        borderBottomWidth: active ? 3 : 0,
        borderBottomColor: "#6C63FF",
      }}>
      <Text
        style={{
          color: active ? "#6C63FF" : "#667085",
          fontSize: 16,
          fontWeight: active ? "700" : "600",
        }}>
        {label}
      </Text>
    </View>
  );
}
