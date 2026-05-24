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

import { router, useLocalSearchParams } from "expo-router";

import { supabase } from "@/lib/supabase";

import { createAdmissionRequest } from "@/services/admissions";

export default function AdmissionFormScreen() {
  const params = useLocalSearchParams();

  const teacherId = params.teacherId as string;

  const institute = params.institute as string;

  const [loading, setLoading] = useState(false);

  const [batches, setBatches] = useState<any[]>([]);

  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const [studentName, setStudentName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [parentPhone, setParentPhone] = useState("");

  const [schoolName, setSchoolName] = useState("");

  const [year, setYear] = useState("2026");

  const [className, setClassName] = useState("");

  const [batchCategory, setBatchCategory] = useState("");

  useEffect(() => {
    async function loadBatches() {
      const response = await supabase
        .from("batches")
        .select("*")
        .eq("teacher_id", teacherId)
        .eq("is_active", true)
        .eq("admission_open", true)
        .order("created_at", {
          ascending: false,
        });

      if (!response.error) {
        setBatches(response.data || []);
      }
    }

    loadBatches();
  }, []);

  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const classMatch = className ? batch.class_name === className : true;

      const categoryMatch = batchCategory
        ? batch.batch_category === batchCategory
        : true;

      return classMatch && categoryMatch;
    });
  }, [batches, className, batchCategory]);

  async function handleApply() {
    if (!studentName || !phone || !className || !selectedBatch) {
      Alert.alert("Required", "Please fill all required fields.");

      return;
    }

    try {
      setLoading(true);

      const response = await createAdmissionRequest({
        teacherId,

        studentName,

        email,

        phone,

        parentPhone,

        className,

        schoolName,

        year,

        batchId: selectedBatch.batch_id,

        batchName: selectedBatch.batch_name,

        batchCategory: selectedBatch.batch_category,

        batchNumber: selectedBatch.batch_number,
      });

      if (!response.success) {
        Alert.alert("Error", response.error?.message);

        return;
      }

      Alert.alert(
        "Application Submitted",
        "Your admission request has been submitted successfully.",
      );

      router.back();
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
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
            paddingBottom: 200,
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
              }}>
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color="#111827" />
              </TouchableOpacity>

              <View
                style={{
                  marginLeft: 14,
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "800",
                    color: "#111827",
                  }}>
                  Admission Form
                </Text>

                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 13,
                    color: "#6B7280",
                  }}>
                  {/* {institute} */}
                  {teacherId}
                </Text>
              </View>
            </View>
          </View>

          {/* FORM */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 28,
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

            <Input
              label="School Name"
              value={schoolName}
              onChangeText={setSchoolName}
            />

            <Input label="Year" value={year} onChangeText={setYear} />

            {/* CLASS */}
            <Label title="Class" />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 4,
              }}>
              {["9", "10", "11", "12", "Dropper"].map((item) => {
                const active = className === item;

                return (
                  <Chip
                    key={item}
                    label={item}
                    active={active}
                    onPress={() => setClassName(item)}
                  />
                );
              })}
            </ScrollView>

            {/* CATEGORY */}
            <Label title="Course Category" />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 4,
              }}>
              {[...new Set(batches.map((batch) => batch.batch_category))].map(
                (item: any) => {
                  const active = batchCategory === item;

                  return (
                    <Chip
                      key={item}
                      label={item}
                      active={active}
                      onPress={() => setBatchCategory(item)}
                    />
                  );
                },
              )}
            </ScrollView>

            {/* BATCHES */}
            <Label title="Available Batches" />

            {filteredBatches.map((batch, index) => {
              const active = selectedBatch?.id === batch.id;

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.9}
                  onPress={() => setSelectedBatch(batch)}
                  style={{
                    backgroundColor: active ? "#EEF2FF" : "#FFF",

                    borderRadius: 22,

                    padding: 16,

                    marginBottom: 12,

                    borderWidth: active ? 1.5 : 0,

                    borderColor: "#4F46E5",
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

                    {active && (
                      <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 10,
                          backgroundColor: "#4F46E5",

                          justifyContent: "center",

                          alignItems: "center",
                        }}>
                        <Check size={16} color="#FFF" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* BUTTON */}
        <View
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 24,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={loading}
            onPress={handleApply}
            style={{
              height: 58,
              borderRadius: 18,
              backgroundColor: "#4F46E5",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                color: "#FFF",
                fontSize: 16,
                fontWeight: "700",
              }}>
              {loading ? "Submitting..." : "Apply For Admission"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    <View
      style={{
        marginBottom: 18,
      }}>
      <Text
        style={{
          marginBottom: 10,
          fontSize: 14,
          fontWeight: "700",
          color: "#111827",
        }}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#9CA3AF"
        style={{
          height: 56,
          borderRadius: 18,
          backgroundColor: "#FFF",
          paddingHorizontal: 16,
          fontSize: 15,
          color: "#111827",
        }}
      />
    </View>
  );
}

function Label({ title }: { title: string }) {
  return (
    <Text
      style={{
        marginBottom: 12,
        marginTop: 6,
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
      }}>
      {title}
    </Text>
  );
}

function Chip({
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
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: active ? "#4F46E5" : "#FFF",

        marginRight: 10,

        marginBottom: 16,
      }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "700",
          color: active ? "#FFF" : "#111827",
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
