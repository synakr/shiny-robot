import { useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, Check, Search, X } from "lucide-react-native";

import { router } from "expo-router";

import { supabase } from "@/lib/supabase";

import { useAuthStore } from "@/store/authStore";

import { getBatchesByTeacher } from "@/services/batches";

export default function AddStudentScreen() {
  const { teacher } = useAuthStore();

  const [studentName, setStudentName] = useState("");

  const [email, setEmail] = useState("");

  const [year, setYear] = useState("");

  const [phone, setPhone] = useState("");

  const [parentPhone, setParentPhone] = useState("");

  const [className, setClassName] = useState("");

  const [batchCategory, setBatchCategory] = useState("");

  const [batchSearch, setBatchSearch] = useState("");

  const [batches, setBatches] = useState<any[]>([]);

  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const [loadingBatches, setLoadingBatches] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadBatches() {
      if (!teacher?.id) return;

      setLoadingBatches(true);

      const response = await getBatchesByTeacher(teacher.id);

      if (response.success) {
        setBatches(response.data || []);
      }

      setLoadingBatches(false);
    }

    loadBatches();
  }, [teacher]);

  const categoryOptions = useMemo<string[]>(() => {
    const categories = batches
      .map((batch) => batch.batch_category)
      .filter((item): item is string => Boolean(item));

    return Array.from(new Set(categories));
  }, [batches]);

  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const isActive = batch.is_active !== false;

      const admissionOpen = batch.admission_open !== false;

      const classMatched = className
        ? String(batch.class_name || "").toLowerCase() ===
          className.toLowerCase()
        : true;

      const categoryMatched = batchCategory
        ? String(batch.batch_category || "").toLowerCase() ===
          batchCategory.toLowerCase()
        : true;

      const yearMatched = year
        ? String(batch.year || "").toLowerCase() === year.toLowerCase()
        : true;

      const searchMatched = batchSearch.trim()
        ? `${batch.batch_name} ${batch.batch_id} ${batch.batch_category}`
            .toLowerCase()
            .includes(batchSearch.trim().toLowerCase())
        : true;

      return (
        isActive &&
        admissionOpen &&
        classMatched &&
        categoryMatched &&
        yearMatched &&
        searchMatched
      );
    });
  }, [batches, className, batchCategory, year, batchSearch]);

  function handleClassPress(item: string) {
    if (className === item) {
      setClassName("");

      setSelectedBatch(null);

      return;
    }

    setClassName(item);

    setSelectedBatch(null);
  }

  function handleCategoryPress(item: string) {
    if (batchCategory === item) {
      setBatchCategory("");

      setSelectedBatch(null);

      return;
    }

    setBatchCategory(item);

    setSelectedBatch(null);
  }

  function handleBatchPress(batch: any) {
    if (selectedBatch?.id === batch.id) {
      setSelectedBatch(null);

      return;
    }

    setSelectedBatch(batch);

    setClassName(batch.class_name || "");

    setBatchCategory(batch.batch_category || "");

    setYear(batch.year || "");
  }

  async function generateEnrollmentId(batchId: string) {
    const response = await supabase
      .from("students")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("batch_id", batchId);

    const nextNumber = (response.count || 0) + 1;

    return `${batchId}${String(nextNumber).padStart(3, "0")}`;
  }

  async function handleAddStudent() {
    if (!teacher?.id) {
      Alert.alert("Error", "Teacher not found.");

      return;
    }

    if (!studentName || !email || !phone || !className || !selectedBatch) {
      Alert.alert(
        "Required",
        "Please fill name, email, phone, class and select a batch.",
      );

      return;
    }

    try {
      setSubmitting(true);

      const enrollmentId = await generateEnrollmentId(selectedBatch.batch_id);

      const response = await supabase.from("students").insert({
        teacher_id: teacher.id,

        student_name: studentName,

        email,

        phone,

        parent_phone: parentPhone,

        class_name: className,

        batch_id: selectedBatch.batch_id,

        batch_name: selectedBatch.batch_name,

        batch_category: selectedBatch.batch_category,

        year: year || selectedBatch.year,

        enrollment_id: enrollmentId,

        payment_status: "Pending",

        attendance: 0,

        tasks_completed: 0,

        performance_score: 0,

        rank: null,
      });

      if (response.error) {
        Alert.alert("Error", response.error.message);

        return;
      }

      await supabase
        .from("batches")
        .update({
          total_students: (selectedBatch.total_students || 0) + 1,
        })
        .eq("id", selectedBatch.id);

      Alert.alert("Success", "Student added successfully.");

      router.back();
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
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
          paddingBottom: 140,
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
          }}>
          <Input
            label="Student Name"
            placeholder="Student Name"
            value={studentName}
            onChangeText={setStudentName}
          />

          <Input
            label="Email"
            placeholder="student@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Year"
            placeholder="Year"
            value={year}
            onChangeText={(text) => {
              setYear(text);

              setSelectedBatch(null);
            }}
            keyboardType="number-pad"
          />

          <Input
            label="Phone"
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Input
            label="Parent Phone"
            placeholder="Parent Phone"
            value={parentPhone}
            onChangeText={setParentPhone}
            keyboardType="phone-pad"
          />

          {/* CLASS */}
          <SectionTitle title="Class" />

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}>
            {["9", "10", "11", "12", "Dropper"].map((item) => (
              <SelectChip
                key={item}
                label={item}
                active={className === item}
                onPress={() => handleClassPress(item)}
              />
            ))}
          </View>

          {/* CATEGORY */}
          <SectionTitle title="Batch Category" />

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}>
            {(categoryOptions.length > 0
              ? categoryOptions
              : ["JEE", "NEET", "Foundation", "Others"]
            ).map((item) => (
              <SelectChip
                key={item}
                label={item}
                active={batchCategory === item}
                onPress={() => handleCategoryPress(item)}
              />
            ))}
          </View>

          {/* BATCH NAME */}
          <SectionTitle title="Batch Name" />

          <View
            style={{
              height: 54,
              borderRadius: 18,
              backgroundColor: "#FFF",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              marginBottom: 14,
            }}>
            <Search size={20} color="#98A2B3" />

            <TextInput
              value={batchSearch}
              onChangeText={setBatchSearch}
              placeholder="Search batch..."
              placeholderTextColor="#98A2B3"
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: 15,
                color: "#111827",
              }}
            />

            {batchSearch.length > 0 && (
              <TouchableOpacity onPress={() => setBatchSearch("")}>
                <X size={18} color="#667085" />
              </TouchableOpacity>
            )}
          </View>

          {loadingBatches ? (
            <View
              style={{
                marginTop: 20,
                alignItems: "center",
              }}>
              <ActivityIndicator size="large" color="#6C63FF" />
            </View>
          ) : filteredBatches.length === 0 ? (
            <View
              style={{
                backgroundColor: "#FFF",
                borderRadius: 22,
                padding: 22,
                alignItems: "center",
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                No Matching Batches
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: "#667085",
                  textAlign: "center",
                }}>
                Change class, year or category to see available batches.
              </Text>
            </View>
          ) : (
            filteredBatches.map((batch) => (
              <BatchOptionCard
                key={batch.id}
                batch={batch}
                selected={selectedBatch?.id === batch.id}
                onPress={() => handleBatchPress(batch)}
              />
            ))
          )}

          {/* SELECTED BATCH */}
          {selectedBatch && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setSelectedBatch(null)}
              style={{
                backgroundColor: "#FFF",
                borderRadius: 24,
                padding: 18,
                marginTop: 20,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "800",
                  color: "#111827",
                }}>
                Selected Batch
              </Text>

              <InfoLine label="Batch ID" value={selectedBatch.batch_id} />

              <InfoLine label="Batch Name" value={selectedBatch.batch_name} />

              <InfoLine
                label="Category"
                value={selectedBatch.batch_category}
              />

              <InfoLine label="Class" value={selectedBatch.class_name} />

              <Text
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#6C63FF",
                }}>
                Tap this card to unselect batch
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ADD BUTTON */}
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={submitting}
          onPress={handleAddStudent}
          style={{
            height: 58,
            borderRadius: 18,
            backgroundColor: "#6C63FF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 34,
            opacity: submitting ? 0.7 : 1,
          }}>
          <Text
            style={{
              color: "#FFF",
              fontSize: 17,
              fontWeight: "800",
            }}>
            {submitting ? "Adding..." : "Add Student"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
}: {
  label: string;

  placeholder: string;

  value: string;

  onChangeText: (text: string) => void;

  keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad";

  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View
      style={{
        marginBottom: 18,
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
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType || "default"}
        autoCapitalize={autoCapitalize || "sentences"}
        style={{
          height: 54,
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

function SectionTitle({ title }: { title: string }) {
  return (
    <Text
      style={{
        marginTop: 8,
        marginBottom: 14,
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
      }}>
      {title}
    </Text>
  );
}

function SelectChip({
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
        minWidth: 68,
        height: 50,
        paddingHorizontal: 18,
        borderRadius: 18,
        backgroundColor: active ? "#6C63FF" : "#FFF",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text
        style={{
          color: active ? "#FFF" : "#111827",
          fontSize: 16,
          fontWeight: "800",
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function BatchOptionCard({
  batch,
  selected,
  onPress,
}: {
  batch: any;

  selected: boolean;

  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={{
        backgroundColor: selected ? "#EEE8FF" : "#FFF",
        borderRadius: 22,
        padding: 18,
        marginBottom: 14,
        borderWidth: selected ? 2 : 0,
        borderColor: selected ? "#6C63FF" : "transparent",
      }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#111827",
            }}>
            {batch.batch_name}
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 14,
              color: "#667085",
            }}>
            {batch.batch_id} • Class {batch.class_name} •{" "}
            {batch.batch_category}
          </Text>
        </View>

        {selected && (
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: "#6C63FF",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 12,
            }}>
            <Check size={24} color="#FFF" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <Text
      style={{
        marginTop: 12,
        fontSize: 15,
        color: "#667085",
        fontWeight: "600",
      }}>
      {label}:{" "}
      <Text
        style={{
          color: "#111827",
          fontWeight: "800",
        }}>
        {value || "-"}
      </Text>
    </Text>
  );
}