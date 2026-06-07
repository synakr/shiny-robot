import { useState } from "react";

import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  BookOpen,
  ClipboardCheck,
  Clock3,
  Layers3,
  Pencil,
  Plus,
  Users,
  X,
} from "lucide-react-native";

import { router } from "expo-router";

type Course = {
  id: string;
  title: string;
  category: string;
  studentsCount: string;
  duration: string;
  color: string;
  accent: string;
};

const initialCourses: Course[] = [
  {
    id: "1",
    title: "JEE Ultimate 2026",
    category: "JEE",
    studentsCount: "124",
    duration: "12 Months",
    color: "#EEF2FF",
    accent: "#4F46E5",
  },
  {
    id: "2",
    title: "NEET Crash Course",
    category: "NEET",
    studentsCount: "82",
    duration: "6 Months",
    color: "#ECFDF5",
    accent: "#059669",
  },
  {
    id: "3",
    title: "Foundation Batch 10",
    category: "Foundation",
    studentsCount: "58",
    duration: "1 Year",
    color: "#FFF7ED",
    accent: "#D97706",
  },
];

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  const [showCourseModal, setShowCourseModal] = useState(false);

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [courseTitle, setCourseTitle] = useState("");

  const [category, setCategory] = useState("JEE");

  const [studentsCount, setStudentsCount] = useState("");

  const [duration, setDuration] = useState("");

  function getCourseTheme(courseCategory: string) {
    if (courseCategory === "JEE") {
      return {
        color: "#EEF2FF",
        accent: "#4F46E5",
      };
    }

    if (courseCategory === "NEET") {
      return {
        color: "#ECFDF5",
        accent: "#059669",
      };
    }

    if (courseCategory === "Foundation") {
      return {
        color: "#FFF7ED",
        accent: "#D97706",
      };
    }

    return {
      color: "#F3F4F6",
      accent: "#4B5563",
    };
  }

  function resetForm() {
    setCourseTitle("");

    setCategory("JEE");

    setStudentsCount("");

    setDuration("");

    setEditingCourseId(null);
  }

  function openAddCourseModal() {
    resetForm();

    setModalMode("add");

    setShowCourseModal(true);
  }

  function openEditCourseModal(course: Course) {
    setSelectedCourse(null);

    setModalMode("edit");

    setEditingCourseId(course.id);

    setCourseTitle(course.title);

    setCategory(course.category);

    setStudentsCount(course.studentsCount);

    setDuration(course.duration);

    setShowCourseModal(true);
  }

  function handleSaveCourse() {
    if (!courseTitle.trim() || !studentsCount.trim() || !duration.trim()) {
      Alert.alert(
        "Required",
        "Please enter course name, students count and duration.",
      );

      return;
    }

    const theme = getCourseTheme(category);

    if (modalMode === "add") {
      const newCourse: Course = {
        id: Date.now().toString(),
        title: courseTitle.trim(),
        category,
        studentsCount: studentsCount.trim(),
        duration: duration.trim(),
        color: theme.color,
        accent: theme.accent,
      };

      setCourses((prev) => [newCourse, ...prev]);
    } else {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingCourseId
            ? {
                ...course,
                title: courseTitle.trim(),
                category,
                studentsCount: studentsCount.trim(),
                duration: duration.trim(),
                color: theme.color,
                accent: theme.accent,
              }
            : course,
        ),
      );
    }

    resetForm();

    setShowCourseModal(false);
  }

  function handleLaunchTestSeries() {
    router.push("/teacher/create-test" as any);
  }

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
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={openAddCourseModal}
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

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleLaunchTestSeries}
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
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                category={course.category}
                students={`${course.studentsCount} Students`}
                duration={course.duration}
                color={course.color}
                accent={course.accent}
                onPress={() => setSelectedCourse(course)}
                onEdit={() => openEditCourseModal(course)}
              />
            ))}
          </View>
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={openAddCourseModal}
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

      {/* ADD / EDIT COURSE MODAL */}
      <Modal
        visible={showCourseModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCourseModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.25)",
            justifyContent: "flex-end",
          }}>
          <View
            style={{
              backgroundColor: "#FFF",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              padding: 20,
              paddingBottom: 34,
            }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                {modalMode === "add" ? "Add Course" : "Edit Course"}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  resetForm();

                  setShowCourseModal(false);
                }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 14,
                  backgroundColor: "#F3F4F6",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <X size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            <Input
              label="Course Name"
              placeholder="Eg. JEE Ultimate 2027"
              value={courseTitle}
              onChangeText={setCourseTitle}
            />

            <Text
              style={{
                marginTop: 18,
                marginBottom: 10,
                fontSize: 14,
                fontWeight: "700",
                color: "#111827",
              }}>
              Category
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
              }}>
              {["JEE", "NEET", "Foundation", "Others"].map((item) => (
                <CategoryChip
                  key={item}
                  label={item}
                  active={category === item}
                  onPress={() => setCategory(item)}
                />
              ))}
            </View>

            <Input
              label="Number of Students"
              placeholder="Eg. 120"
              value={studentsCount}
              keyboardType="number-pad"
              onChangeText={setStudentsCount}
            />

            <Input
              label="Course Duration"
              placeholder="Eg. 12 Months"
              value={duration}
              onChangeText={setDuration}
            />

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleSaveCourse}
              style={{
                height: 56,
                borderRadius: 18,
                backgroundColor: "#6C63FF",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 24,
              }}>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 16,
                  fontWeight: "700",
                }}>
                {modalMode === "add" ? "Add Course" : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* COURSE DETAILS MODAL */}
      <Modal
        visible={!!selectedCourse}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCourse(null)}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.25)",
            justifyContent: "center",
            paddingHorizontal: 22,
          }}>
          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 28,
              padding: 20,
            }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 22,
                  fontWeight: "800",
                  color: "#111827",
                  paddingRight: 12,
                }}>
                {selectedCourse?.title}
              </Text>

              <TouchableOpacity
                onPress={() => setSelectedCourse(null)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 14,
                  backgroundColor: "#F3F4F6",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <X size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                marginTop: 8,
                fontSize: 14,
                fontWeight: "700",
                color: selectedCourse?.accent || "#6C63FF",
              }}>
              {selectedCourse?.category}
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 22,
                gap: 12,
              }}>
              <DetailBox
                title="Students"
                value={
                  selectedCourse
                    ? `${selectedCourse.studentsCount} Students`
                    : "-"
                }
              />

              <DetailBox
                title="Duration"
                value={selectedCourse?.duration || "-"}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (selectedCourse) {
                  openEditCourseModal(selectedCourse);
                }
              }}
              style={{
                height: 52,
                borderRadius: 16,
                backgroundColor: "#F3E8FF",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 22,
              }}>
              <Text
                style={{
                  color: "#7C3AED",
                  fontSize: 15,
                  fontWeight: "800",
                }}>
                Edit Course
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setSelectedCourse(null);

                router.push("/teacher/batches" as any);
              }}
              style={{
                height: 52,
                borderRadius: 16,
                backgroundColor: "#EEF2FF",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 12,
              }}>
              <Text
                style={{
                  color: "#4F46E5",
                  fontSize: 15,
                  fontWeight: "800",
                }}>
                Manage Batches
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setSelectedCourse(null);

                router.push("/teacher/create-task" as any);
              }}
              style={{
                height: 52,
                borderRadius: 16,
                backgroundColor: "#ECFDF5",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 12,
              }}>
              <Text
                style={{
                  color: "#059669",
                  fontSize: 15,
                  fontWeight: "800",
                }}>
                Create Task / DPP
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  onPress,
  onEdit,
}: {
  title: string;

  category: string;

  students: string;

  duration: string;

  color: string;

  accent: string;

  onPress?: () => void;

  onEdit?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
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

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={(event) => {
            event.stopPropagation();

            onEdit?.();
          }}
          style={{
            width: 38,
            height: 38,
            borderRadius: 14,
            backgroundColor: "#F3F4F6",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 10,
          }}>
          <Pencil size={17} color="#4B5563" />
        </TouchableOpacity>
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

function Input({
  label,
  placeholder,
  value,
  keyboardType,
  onChangeText,
}: {
  label: string;

  placeholder: string;

  value: string;

  keyboardType?: "default" | "number-pad";

  onChangeText: (text: string) => void;
}) {
  return (
    <View
      style={{
        marginTop: 18,
      }}>
      <Text
        style={{
          marginBottom: 8,
          fontSize: 14,
          fontWeight: "700",
          color: "#111827",
        }}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || "default"}
        placeholder={placeholder}
        placeholderTextColor="#98A2B3"
        style={{
          height: 54,
          borderRadius: 16,
          backgroundColor: "#F9FAFB",
          paddingHorizontal: 16,
          fontSize: 15,
          color: "#111827",
        }}
      />
    </View>
  );
}

function CategoryChip({
  label,
  active,
  onPress,
}: {
  label: string;

  active: boolean;

  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: active ? "#6C63FF" : "#F3F4F6",
      }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "700",
          color: active ? "#FFF" : "#667085",
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function DetailBox({
  title,
  value,
}: {
  title: string;

  value: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
        borderRadius: 18,
        padding: 14,
      }}>
      <Text
        style={{
          fontSize: 12,
          color: "#98A2B3",
          fontWeight: "600",
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 15,
          fontWeight: "800",
          color: "#111827",
        }}>
        {value}
      </Text>
    </View>
  );
}