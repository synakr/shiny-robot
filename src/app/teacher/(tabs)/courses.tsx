import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  BookOpen,
  ClipboardCheck,
  Clock3,
  Layers3,
  Plus,
  Users,
} from "lucide-react-native";

export default function CoursesScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 140,
          }}>
          {/* HEADER */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 16,
            }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: "#111827",
              }}>
              Courses
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontSize: 14,
                color: "#667085",
              }}>
              Launch and manage your courses & test series
            </Text>
          </View>

          {/* ACTIONS */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 24,
              flexDirection: "row",
              gap: 14,
            }}>
            {/* COURSE */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                flex: 1,
                backgroundColor: "#EEF2FF",
                borderRadius: 24,
                padding: 18,
              }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 18,
                  backgroundColor: "#C7D2FE",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <BookOpen size={24} color="#4338CA" />
              </View>

              <Text
                style={{
                  marginTop: 18,
                  fontSize: 17,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Launch Course
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  lineHeight: 20,
                  color: "#667085",
                }}>
                Create structured batches with notes, tasks & tracking
              </Text>
            </TouchableOpacity>

            {/* TEST SERIES */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                flex: 1,
                backgroundColor: "#ECFDF5",
                borderRadius: 24,
                padding: 18,
              }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 18,
                  backgroundColor: "#A7F3D0",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <ClipboardCheck size={24} color="#047857" />
              </View>

              <Text
                style={{
                  marginTop: 18,
                  fontSize: 17,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Launch Test Series
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  lineHeight: 20,
                  color: "#667085",
                }}>
                Conduct tests, rankings & performance analysis
              </Text>
            </TouchableOpacity>
          </View>

          {/* SECTION */}
          <Text
            style={{
              paddingHorizontal: 20,
              marginTop: 30,
              fontSize: 18,
              fontWeight: "800",
              color: "#111827",
            }}>
            Active Courses
          </Text>

          {/* COURSE LIST */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 16,
            }}>
            <CourseCard
              title="JEE Ultimate 2026"
              category="JEE"
              students="124 Students"
              duration="12 Months"
              color="#EEF2FF"
              accent="#4F46E5"
            />

            <CourseCard
              title="NEET Crash Course"
              category="NEET"
              students="82 Students"
              duration="6 Months"
              color="#ECFDF5"
              accent="#059669"
            />

            <CourseCard
              title="Foundation Batch 10"
              category="Foundation"
              students="58 Students"
              duration="1 Year"
              color="#FFF7ED"
              accent="#D97706"
            />
          </View>
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            position: "absolute",
            right: 20,
            bottom: 100,
            width: 62,
            height: 62,
            borderRadius: 31,
            backgroundColor: "#6C63FF",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 6,
          }}>
          <Plus size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function CourseCard({
  title,
  category,
  students,
  duration,
  color,
  accent,
}: {
  title: string;

  category: string;

  students: string;

  duration: string;

  color: string;

  accent: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      {/* TOP */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 18,
              backgroundColor: color,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 14,
            }}>
            <Layers3 size={24} color={accent} />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: "#111827",
              }}>
              {title}
            </Text>

            <Text
              style={{
                marginTop: 5,
                fontSize: 13,
                color: accent,
                fontWeight: "700",
              }}>
              {category}
            </Text>
          </View>
        </View>
      </View>

      {/* STATS */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 18,
          gap: 22,
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <Users size={15} color="#667085" />

          <Text
            style={{
              marginLeft: 6,
              fontSize: 13,
              color: "#667085",
              fontWeight: "600",
            }}>
            {students}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <Clock3 size={15} color="#667085" />

          <Text
            style={{
              marginLeft: 6,
              fontSize: 13,
              color: "#667085",
              fontWeight: "600",
            }}>
            {duration}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
