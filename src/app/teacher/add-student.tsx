import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Check } from "lucide-react-native";

import { router } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { createStudent } from "@/services/students";

import { getBatchesByTeacher } from "@/services/batches";

export default function AddStudentScreen() {
  const { teacher } = useAuthStore();

  const [batches, setBatches] = useState<any[]>([]);

  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const [studentName, setStudentName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [parentPhone, setParentPhone] = useState("");

  const [year, setYear] = useState("");

  const [className, setClassName] = useState("");

  const [batchCategory, setBatchCategory] = useState("");

  useEffect(() => {
    async function loadBatches() {
      if (!teacher?.id) return;

      const response = await getBatchesByTeacher(teacher.id);

      if (response.success) {
        setBatches(response.data || []);
      }
    }

    loadBatches();
  }, [teacher]);

  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const yearMatch = !year || batch.year === year;

      const classMatch = !className || batch.class_name === className;

      const categoryMatch =
        !batchCategory || batch.batch_category === batchCategory;

      return yearMatch && classMatch && categoryMatch;
    });
  }, [batches, year, className, batchCategory]);

  const categories = useMemo(() => {
    return [...new Set(batches.map((batch) => batch.batch_category))];
  }, [batches]);

  async function handleAddStudent() {
    if (!studentName || !selectedBatch) {
      Alert.alert("Required", "Please fill all required fields.");

      return;
    }

    const randomNumber = Math.floor(Math.random() * 900 + 100);

    const enrollmentId = `${selectedBatch.batch_id}-${randomNumber}`;

    const response = await createStudent({
      teacherId: teacher?.id || "",

      studentName,

      email,

      phone,

      parentPhone,

      className: selectedBatch.class_name,

      batchName: selectedBatch.batch_name,

      batchId: selectedBatch.batch_id,

      batchCategory: selectedBatch.batch_category,

      year: selectedBatch.year,

      enrollmentId,

      paymentStatus: "Pending",
    });

    if (!response.success) {
      Alert.alert("Error", response.error?.message);

      return;
    }

    Alert.alert("Success", "Student added successfully.");

    router.back();
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}>
        {/* HEADER */}
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
            Add Student
          </Text>
        </View>

        {/* FORM */}
        <View
          style={{
            marginTop: 28,
            gap: 18,
          }}>
          <Input
            label="Student Name"
            value={studentName}
            onChangeText={setStudentName}
          />

          <Input label="Email" value={email} onChangeText={setEmail} />

          <Input label="Phone" value={phone} onChangeText={setPhone} />

          <Input
            label="Parent Phone"
            value={parentPhone}
            onChangeText={setParentPhone}
          />

          <Input label="Year" value={year} onChangeText={setYear} />

          {/* CLASS */}
          <DropdownSection
            title="Class"
            options={["9", "10", "11", "12", "Dropper"]}
            selected={className}
            onSelect={setClassName}
          />

          {/* CATEGORY */}
          <DropdownSection
            title="Batch Category"
            options={categories}
            selected={batchCategory}
            onSelect={setBatchCategory}
          />

          {/* BATCHES */}
          <View>
            <Text
              style={{
                marginBottom: 12,
                fontSize: 14,
                fontWeight: "700",
                color: "#111827",
              }}>
              Batch Name
            </Text>

            {filteredBatches.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 18,
                  padding: 16,
                }}>
                <Text
                  style={{
                    color: "#98A2B3",
                    fontSize: 13,
                  }}>
                  No matching batches found
                </Text>
              </View>
            ) : (
              filteredBatches.map((batch, index) => {
                const selected = selectedBatch?.id === batch.id;

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.9}
                    onPress={() => setSelectedBatch(batch)}
                    style={{
                      backgroundColor: selected ? "#EEE8FF" : "#FFF",

                      borderRadius: 20,

                      padding: 16,

                      marginBottom: 12,

                      borderWidth: selected ? 1.5 : 0,

                      borderColor: "#6C63FF",
                    }}>
                    <View
                      style={{
                        flexDirection: "row",

                        justifyContent: "space-between",

                        alignItems: "center",
                      }}>
                      <View
                        style={{
                          flex: 1,
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "800",
                            color: "#111827",
                          }}>
                          {batch.batch_name}
                        </Text>

                        <Text
                          style={{
                            marginTop: 5,
                            fontSize: 12,
                            color: "#667085",
                          }}>
                          {batch.batch_id} • Class {batch.class_name} •{" "}
                          {batch.batch_category}
                        </Text>
                      </View>

                      {selected && (
                        <View
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 10,
                            backgroundColor: "#6C63FF",

                            justifyContent: "center",

                            alignItems: "center",
                          }}>
                          <Check size={16} color="#FFF" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* SELECTED BATCH */}
          {selectedBatch && (
            <View
              style={{
                backgroundColor: "#FFF",
                borderRadius: 22,
                padding: 18,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Selected Batch
              </Text>

              <Text
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  color: "#667085",
                }}>
                Batch ID: {selectedBatch.batch_id}
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: "#667085",
                }}>
                Batch Name: {selectedBatch.batch_name}
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: "#667085",
                }}>
                Category: {selectedBatch.batch_category}
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: "#667085",
                }}>
                Class: {selectedBatch.class_name}
              </Text>
            </View>
          )}
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleAddStudent}
          style={{
            height: 58,
            borderRadius: 18,
            backgroundColor: "#6C63FF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 34,
          }}>
          <Text
            style={{
              color: "#FFF",
              fontSize: 16,
              fontWeight: "700",
            }}>
            Add Student
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Input({
  label,
  value,
  onChangeText,
}: {
  label: string;

  value: string;

  onChangeText: (text: string) => void;
}) {
  return (
    <View>
      <Text
        style={{
          marginBottom: 8,
          fontSize: 14,
          fontWeight: "600",
          color: "#374151",
        }}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#9CA3AF"
        style={{
          height: 54,
          borderRadius: 16,
          backgroundColor: "#FFF",
          paddingHorizontal: 16,
          fontSize: 15,
          color: "#111827",
        }}
      />
    </View>
  );
}

function DropdownSection({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;

  options: string[];

  selected: string;

  onSelect: (value: string) => void;
}) {
  return (
    <View>
      <Text
        style={{
          marginBottom: 10,
          fontSize: 14,
          fontWeight: "700",
          color: "#111827",
        }}>
        {title}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((option, index) => {
          const active = selected === option;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => onSelect(option)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 16,
                backgroundColor: active ? "#6C63FF" : "#FFF",

                marginRight: 10,
              }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: active ? "#FFF" : "#111827",
                }}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
