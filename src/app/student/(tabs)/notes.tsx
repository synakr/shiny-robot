import { useState } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Search, SlidersHorizontal } from "lucide-react-native";

import FilterPill from "@/components/FilterPill";
import NotesCard from "@/components/NotesCard";

const notes = [
  {
    title: "Trigonometry\nFormulas",
    type: "Image",
    size: "2.4 MB",
    date: "2 May 2024",
    color: "#DDF5D5",
    badge: "NEW",
  },
  {
    title: "Physics Chapter 3\nHandwritten Notes",
    type: "PDF",
    size: "4.1 MB",
    date: "1 May 2024",
    color: "#FFE2C7",
  },
  {
    title: "Chemistry - Organic\nReactions",
    type: "Image",
    size: "1.8 MB",
    date: "30 Apr 2024",
    color: "#DCEEFF",
  },
  {
    title: "Maths Chapter 2\nShort Notes",
    type: "PDF",
    size: "2.2 MB",
    date: "29 Apr 2024",
    color: "#DDF5EF",
  },
  {
    title: "Important Derivations",
    type: "Image",
    size: "3.2 MB",
    date: "28 Apr 2024",
    color: "#FFEAD7",
  },
];

export default function NotesScreen() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredNotes =
    activeFilter === "All"
      ? notes
      : notes.filter(
          (item) => item.type.toLowerCase() === activeFilter.toLowerCase(),
        );

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
              Notes
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 18,
              }}>
              <TouchableOpacity>
                <Search size={24} color="#4B5563" />
              </TouchableOpacity>

              <TouchableOpacity>
                <SlidersHorizontal size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* TOP TABS */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 28,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
          }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              paddingBottom: 14,
              borderBottomWidth: 3,
              borderBottomColor: "#6C63FF",
            }}>
            <Text
              style={{
                color: "#6C63FF",
                fontSize: 16,
                fontWeight: "700",
              }}>
              Recent (7 Days)
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              paddingBottom: 14,
            }}>
            <Text
              style={{
                color: "#667085",
                fontSize: 16,
                fontWeight: "600",
              }}>
              Archive
            </Text>
          </View>
        </View>

        {/* FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 6,
          }}>
          <FilterPill
            label="All"
            active={activeFilter === "All"}
            onPress={() => setActiveFilter("All")}
          />

          <FilterPill
            label="Images"
            active={activeFilter === "Image"}
            onPress={() => setActiveFilter("Image")}
          />

          <FilterPill
            label="PDF"
            active={activeFilter === "PDF"}
            onPress={() => setActiveFilter("PDF")}
          />

          <FilterPill
            label="Documents"
            active={activeFilter === "Document"}
            onPress={() => setActiveFilter("Document")}
          />
        </ScrollView>

        {/* NOTES LIST */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 10,
          }}>
          {filteredNotes.map((item, index) => (
            <NotesCard
              key={index}
              title={item.title}
              type={item.type}
              size={item.size}
              date={item.date}
              color={item.color}
              badge={item.badge}
            />
          ))}
        </View>

        {/* STORAGE */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}>
            <Text
              style={{
                fontSize: 15,
                color: "#374151",
                fontWeight: "500",
              }}>
              Storage Used
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: "#374151",
                fontWeight: "600",
              }}>
              2.6 GB / 5 GB
            </Text>
          </View>

          <View
            style={{
              height: 8,
              borderRadius: 20,
              backgroundColor: "#E5E7EB",
              overflow: "hidden",
            }}>
            <View
              style={{
                width: "52%",
                height: "100%",
                backgroundColor: "#6C63FF",
                borderRadius: 20,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
