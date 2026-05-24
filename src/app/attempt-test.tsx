import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect, useMemo, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft } from "lucide-react-native";

import { router, useLocalSearchParams } from "expo-router";

import {
  getQuestionsByTest,
  shuffleQuestions,
  submitTest,
} from "@/services/test-attempt";

import { useAuthStore } from "@/store/authStore";

export default function AttemptTestScreen() {
  const { testId } = useLocalSearchParams();

  const { student } = useAuthStore();

  const [questions, setQuestions] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<any>({});

  useEffect(() => {
    async function loadQuestions() {
      const response = await getQuestionsByTest(testId as string);

      if (response.success) {
        const randomized = shuffleQuestions(response.data || []);

        setQuestions(randomized);
      }

      setLoading(false);
    }

    loadQuestions();
  }, [testId]);

  const currentQuestion = questions[currentIndex];

  const selectedOption = answers[currentQuestion?.id];

  function handleSelectOption(optionKey: string) {
    setAnswers((prev: any) => ({
      ...prev,

      [currentQuestion.id]: optionKey,
    }));
  }

  async function handleSubmitTest() {
    try {
      setSubmitting(true);

      const response = await submitTest({
        testId: testId as string,

        studentId: student?.id || "",

        answers,

        questions,
      });

      if (!response.success) {
        Alert.alert("Error", "Failed to submit test.");

        return;
      }

      Alert.alert(
        "Test Submitted",
        `Your score is ${response.score}/${questions.length}`,
      );

      router.back();
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const progress = useMemo(() => {
    if (!questions.length) return 0;

    return Math.round(((currentIndex + 1) / questions.length) * 100);
  }, [currentIndex, questions]);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8F8F8",
        }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8F8F8",
        }}>
        <Text>No Questions Found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 14,
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={26} color="#111827" />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: "#111827",
              }}>
              Question {currentIndex + 1}/{questions.length}
            </Text>
          </View>

          {/* PROGRESS */}
          <View
            style={{
              height: 8,
              backgroundColor: "#E5E7EB",
              borderRadius: 99,
              overflow: "hidden",
              marginTop: 18,
            }}>
            <View
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#6C63FF",
              }}
            />
          </View>
        </View>

        {/* QUESTION */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 140,
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 28,
            }}>
            <View
              style={{
                backgroundColor: "#FFF",
                borderRadius: 28,
                padding: 22,
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "800",
                  color: "#111827",
                  lineHeight: 34,
                }}>
                {currentQuestion.question}
              </Text>

              {/* OPTIONS */}
              <View
                style={{
                  marginTop: 28,
                }}>
                {currentQuestion.options.map((option: any, index: number) => {
                  const isSelected = selectedOption === option.key;

                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.9}
                      onPress={() => handleSelectOption(option.key)}
                      style={{
                        backgroundColor: isSelected ? "#EEE8FF" : "#F9FAFB",

                        borderWidth: 1.5,

                        borderColor: isSelected ? "#6C63FF" : "#E5E7EB",

                        borderRadius: 20,

                        padding: 18,

                        marginBottom: 14,

                        flexDirection: "row",

                        alignItems: "center",
                      }}>
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 17,
                          backgroundColor: isSelected ? "#6C63FF" : "#FFF",

                          borderWidth: 1.5,

                          borderColor: isSelected ? "#6C63FF" : "#D1D5DB",

                          justifyContent: "center",

                          alignItems: "center",

                          marginRight: 14,
                        }}>
                        <Text
                          style={{
                            color: isSelected ? "#FFF" : "#667085",

                            fontWeight: "700",

                            fontSize: 14,
                          }}>
                          {option.key.toUpperCase()}
                        </Text>
                      </View>

                      <Text
                        style={{
                          flex: 1,

                          fontSize: 15,

                          lineHeight: 24,

                          color: "#111827",

                          fontWeight: "600",
                        }}>
                        {option.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* FOOTER */}
        <View
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 24,

            flexDirection: "row",

            justifyContent: "space-between",

            gap: 12,
          }}>
          <TouchableOpacity
            disabled={currentIndex === 0}
            onPress={() => setCurrentIndex((prev) => prev - 1)}
            style={{
              flex: 1,

              height: 56,

              borderRadius: 18,

              backgroundColor: "#FFF",

              justifyContent: "center",

              alignItems: "center",

              borderWidth: 1,

              borderColor: "#E5E7EB",

              opacity: currentIndex === 0 ? 0.5 : 1,
            }}>
            <Text
              style={{
                fontSize: 15,

                fontWeight: "700",

                color: "#111827",
              }}>
              Previous
            </Text>
          </TouchableOpacity>

          {currentIndex === questions.length - 1 ? (
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={submitting}
              onPress={handleSubmitTest}
              style={{
                flex: 1,

                height: 56,

                borderRadius: 18,

                backgroundColor: "#10B981",

                justifyContent: "center",

                alignItems: "center",

                opacity: submitting ? 0.7 : 1,
              }}>
              <Text
                style={{
                  color: "#FFF",

                  fontSize: 15,

                  fontWeight: "700",
                }}>
                {submitting ? "Submitting..." : "Submit Test"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setCurrentIndex((prev) => prev + 1)}
              style={{
                flex: 1,

                height: 56,

                borderRadius: 18,

                backgroundColor: "#6C63FF",

                justifyContent: "center",

                alignItems: "center",
              }}>
              <Text
                style={{
                  color: "#FFF",

                  fontSize: 15,

                  fontWeight: "700",
                }}>
                Next
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
