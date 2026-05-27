import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useEffect, useMemo, useRef, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft } from "lucide-react-native";

import { router, useLocalSearchParams } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { supabase } from "@/lib/supabase";

export default function AttemptTestScreen() {
  const { testId, assignmentId } = useLocalSearchParams();

  const { student } = useAuthStore();

  const [questions, setQuestions] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<any>({});

  const [remainingTime, setRemainingTime] = useState(0);

  const intervalRef = useRef<any>(null);

  // LOAD QUESTIONS
  useEffect(() => {
    async function loadQuestions() {
      const response = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_id", testId)
        .order("question_order", {
          ascending: true,
        });

      if (response.data) {
        // SHUFFLE ONLY ONCE
        const randomizedQuestions = shuffleArray(response.data).map(
          (question: any) => ({
            ...question,

            options: shuffleArray([
              {
                key: "a",

                text: question.option_a,

                explanation: question.option_a_explanation,
              },

              {
                key: "b",

                text: question.option_b,

                explanation: question.option_b_explanation,
              },

              {
                key: "c",

                text: question.option_c,

                explanation: question.option_c_explanation,
              },

              {
                key: "d",

                text: question.option_d,

                explanation: question.option_d_explanation,
              },
            ]),
          }),
        );

        setQuestions(randomizedQuestions);

        // RESTORE ANSWERS
        const savedAnswers = await AsyncStorage.getItem(
          `test-answers-${assignmentId}`,
        );

        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        }

        // RESTORE INDEX
        const savedIndex = await AsyncStorage.getItem(
          `test-current-${assignmentId}`,
        );

        if (savedIndex) {
          setCurrentIndex(Number(savedIndex));
        }

        // TIMER
        const storageKey = `test-start-${assignmentId}`;

        const existingStart = await AsyncStorage.getItem(storageKey);

        let startTime = existingStart;

        if (!startTime) {
          startTime = Date.now().toString();

          await AsyncStorage.setItem(storageKey, startTime);
        }

        const startedAt = Number(startTime);

        const durationSeconds = 60 * 60;

        function updateTimer() {
          const elapsed = Math.floor((Date.now() - startedAt) / 1000);

          const remaining = durationSeconds - elapsed;

          if (remaining <= 0) {
            clearInterval(intervalRef.current);

            handleSubmitTest();

            return;
          }

          setRemainingTime(remaining);
        }

        updateTimer();

        intervalRef.current = setInterval(updateTimer, 1000);
      }

      setLoading(false);
    }

    loadQuestions();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // AUTOSAVE
  useEffect(() => {
    async function saveProgress() {
      await AsyncStorage.setItem(
        `test-answers-${assignmentId}`,
        JSON.stringify(answers),
      );

      await AsyncStorage.setItem(
        `test-current-${assignmentId}`,
        currentIndex.toString(),
      );
    }

    if (questions.length) {
      saveProgress();
    }
  }, [answers, currentIndex]);

  const currentQuestion = questions[currentIndex];

  const selectedOption = answers[currentQuestion?.id];

  function handleSelectOption(option: string) {
    setAnswers((prev: any) => ({
      ...prev,

      [currentQuestion.id]: option,
    }));
  }

  async function handleSubmitTest() {
    try {
      setSubmitting(true);

      let score = 0;

      const answerRows = questions.map((question) => {
        const selected = answers[question.id];

        const isCorrect = selected === question.correct_option;

        if (isCorrect) {
          score += question.marks || 1;
        }

        return {
          question_id: question.id,

          selected_option: selected || null,

          is_correct: isCorrect,
        };
      });

      // CREATE ATTEMPT
      const studentTestResponse = await supabase
        .from("student_tests")
        .insert({
          assignment_id: assignmentId,

          test_id: testId,

          student_id: student?.id || "",

          score,
        })
        .select()
        .single();

      if (studentTestResponse.error) {
        Alert.alert("Error", "Failed to submit.");

        return;
      }

      // INSERT ANSWERS
      const finalAnswers = answerRows.map((answer) => ({
        ...answer,

        student_test_id: studentTestResponse.data.id,
      }));

      const answerInsertResponse = await supabase
        .from("student_test_answers")
        .insert(finalAnswers);

      if (answerInsertResponse.error) {
        Alert.alert("Error", "Failed to save answers.");

        return;
      }

      // CLEAR STORAGE
      await AsyncStorage.removeItem(`test-answers-${assignmentId}`);

      await AsyncStorage.removeItem(`test-current-${assignmentId}`);

      await AsyncStorage.removeItem(`test-start-${assignmentId}`);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      Alert.alert("Submitted", `Score: ${score}/${questions.length}`, [
        {
          text: "View Review",

          onPress: () => {
            router.push({
              pathname: "/student/test-review",

              params: {
                assignmentId,
              },
            });
          },
        },
      ]);
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
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={26} color="#111827" />
            </TouchableOpacity>

            <View>
              <Text
                style={{
                  fontWeight: "700",
                }}>
                Question {currentIndex + 1}/{questions.length}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  color: "#EF4444",
                  fontWeight: "700",
                }}>
                ⏳ {formatTime(remainingTime)}
              </Text>
            </View>
          </View>

          {/* PROGRESS */}
          <View
            style={{
              marginTop: 18,
              height: 8,
              borderRadius: 99,
              backgroundColor: "#E5E7EB",
              overflow: "hidden",
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
              {/* QUESTION */}
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "800",
                  lineHeight: 34,
                  color: "#111827",
                }}>
                {currentQuestion.question}
              </Text>

              {/* IMAGE */}
              {currentQuestion.question_image_url && (
                <Image
                  source={{
                    uri: currentQuestion.question_image_url,
                  }}
                  resizeMode="contain"
                  style={{
                    width: "100%",
                    height: 220,
                    borderRadius: 18,
                    marginTop: 18,
                    backgroundColor: "#F3F4F6",
                  }}
                />
              )}

              {/* OPTIONS */}
              <View
                style={{
                  marginTop: 28,
                }}>
                {currentQuestion.options.map((option: any, index: number) => {
                  const isSelected = selectedOption === option.key;

                  return (
                    <TouchableOpacity
                      key={`${option.key}-${index}`}
                      activeOpacity={0.9}
                      onPress={() => handleSelectOption(option.key)}
                      style={{
                        backgroundColor: isSelected ? "#EEE8FF" : "#F9FAFB",

                        borderWidth: 1.5,

                        borderColor: isSelected ? "#6C63FF" : "#E5E7EB",

                        borderRadius: 20,

                        padding: 18,

                        marginBottom: 14,
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          color: "#111827",
                        }}>
                        {option.key.toUpperCase()}. {option.text}
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
                fontWeight: "700",
              }}>
              Previous
            </Text>
          </TouchableOpacity>

          {currentIndex === questions.length - 1 ? (
            <TouchableOpacity
              disabled={submitting}
              onPress={() => handleSubmitTest()}
              style={{
                flex: 1,
                height: 56,
                borderRadius: 18,
                backgroundColor: "#10B981",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Text
                style={{
                  color: "#FFF",
                  fontWeight: "700",
                }}>
                {submitting ? "Submitting..." : "Submit"}
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

function shuffleArray(array: any[]) {
  const copied = [...array];

  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copied[i], copied[j]] = [copied[j], copied[i]];
  }

  return copied;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);

  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
