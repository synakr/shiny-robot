import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";

import FilterChip from "@/components/FilterChip";
import StudentCard from "@/components/StudentCard";

const students = [
  {
    name: "Aarav Sharma",
    className: "Class 11 • Batch A",
    attendance: "92%",
    payment: "Paid",
    paid: true,
  },
  {
    name: "Priya Das",
    className: "Class 12 • Batch B",
    attendance: "85%",
    payment: "Pending",
    paid: false,
  },
  {
    name: "Rahul Verma",
    className: "Class 11 • Batch A",
    attendance: "96%",
    payment: "Paid",
    paid: true,
  },
  {
    name: "Ananya Roy",
    className: "Class 10 • Batch C",
    attendance: "78%",
    payment: "Pending",
    paid: false,
  },
];

export default function StudentsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 220,
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
                justifyContent: "space-between",
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
                    fontSize: 28,
                    fontWeight: "800",
                    color: "#111827",
                  }}>
                  Students
                </Text>
              </View>

              <TouchableOpacity>
                <SlidersHorizontal size={22} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {/* SEARCH */}
            <View
              style={{
                marginTop: 22,
                height: 54,
                borderRadius: 18,
                backgroundColor: "#FFF",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
              }}>
              <Search size={20} color="#98A2B3" />

              <TextInput
                placeholder="Search students..."
                placeholderTextColor="#98A2B3"
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 15,
                  color: "#111827",
                }}
              />
            </View>
          </View>

          {/* FILTERS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              marginTop: 18,
              paddingBottom: 4,
            }}>
            <FilterChip label="All" active />
            <FilterChip label="Paid" />
            <FilterChip label="Pending" />
            <FilterChip label="Batch A" />
            <FilterChip label="Batch B" />
          </ScrollView>

          {/* QUICK STATS */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              marginTop: 16,
              gap: 12,
            }}>
            <StatBox title="Total" value="248" color="#6C63FF" bg="#EEE8FF" />

            <StatBox title="Paid" value="210" color="#10B981" bg="#DCFCE7" />

            <StatBox title="Pending" value="38" color="#F59E0B" bg="#FEF3C7" />
          </View>

          {/* LIST */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 20,
            }}>
            {students.map((student, index) => (
              <StudentCard
                key={index}
                name={student.name}
                className={student.className}
                attendance={student.attendance}
                payment={student.payment}
                paid={student.paid}
              />
            ))}
          </View>
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 20,
            bottom: 28,
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

function StatBox({
  title,
  value,
  color,
  bg,
}: {
  title: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg,
        borderRadius: 18,
        paddingVertical: 10,
        alignItems: "center",
      }}>
      <Text
        style={{
          fontSize: 12,
          color,
          fontWeight: "600",
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 18,
          fontWeight: "800",
          color: "#111827",
        }}>
        {value}
      </Text>
    </View>
  );
}
