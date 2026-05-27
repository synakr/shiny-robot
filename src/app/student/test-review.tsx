import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react-native";

import { router, useLocalSearchParams } from "expo-router";

import { supabase } from "@/lib/supabase";

import { useAuthStore } from "@/store/authStore";

export default function TestReviewScreen() {
  const { assignmentId } = useLocalSearchParams();

  const { student } = useAuthStore();

  const [loading, setLoading] = useState(true);

  const [attempt, setAttempt] = useState<any>(null);

  const [reviewData, setReviewData] = useState<any[]>([]);

  useEffect(() => {
    async function loadReview() {
      // LOAD ATTEMPT
      const attemptResponse = await supabase
        .from("student_tests")
        .select("*")
        .eq("assignment_id", assignmentId)
        .eq("student_id", student?.id || "")
        .single();

      if (!attemptResponse.data) {
        setLoading(false);

        return;
      }

      setAttempt(attemptResponse.data);

      // LOAD ANSWERS
      const answersResponse = await supabase
        .from("student_test_answers")
        .select("*")
        .eq("student_test_id", attemptResponse.data.id);

      const answers = answersResponse.data || [];

      // LOAD QUESTIONS
      const questionIds = answers.map((a) => a.question_id);

      const questionsResponse = await supabase
        .from("test_questions")
        .select("*")
        .in("id", questionIds);

      const questions = questionsResponse.data || [];

      // MERGE
      const merged = answers.map((answer) => {
        const question = questions.find((q) => q.id === answer.question_id);

        return {
          ...answer,

          question,
        };
      });

      setReviewData(merged);

      setLoading(false);
    }

    loadReview();
  }, [assignmentId, student?.id]);

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 140,
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
              <ArrowLeft size={26} color="#111827" />
            </TouchableOpacity>

            <Text
              style={{
                marginLeft: 14,
                fontSize: 28,
                fontWeight: "800",
              }}>
              Test Review
            </Text>
          </View>

          {/* SCORE */}
          <View
            style={{
              marginTop: 24,
              backgroundColor: "#6C63FF",
              borderRadius: 24,
              padding: 22,
            }}>
            <Text
              style={{
                color: "#FFF",
              }}>
              Your Score
            </Text>

            <Text
              style={{
                marginTop: 8,
                color: "#FFF",
                fontSize: 34,
                fontWeight: "800",
              }}>
              {attempt?.score}/{reviewData.length}
            </Text>
          </View>
        </View>

        {/* QUESTIONS */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 28,
          }}>
          {reviewData.map((item, index) => {
            const question = item.question;

            if (!question) {
              return null;
            }

            return (
              <View
                key={item.id}
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 28,
                  padding: 22,
                  marginBottom: 18,
                }}>
                {/* STATUS */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                  {item.is_correct ? (
                    <CheckCircle2 size={22} color="#10B981" />
                  ) : (
                    <XCircle size={22} color="#EF4444" />
                  )}

                  <Text
                    style={{
                      marginLeft: 10,
                      fontWeight: "700",
                      color: item.is_correct ? "#10B981" : "#EF4444",
                    }}>
                    {item.is_correct ? "Correct" : "Wrong"}
                  </Text>
                </View>

                {/* QUESTION */}
                <Text
                  style={{
                    marginTop: 18,
                    fontSize: 20,
                    lineHeight: 30,
                    fontWeight: "800",
                  }}>
                  {index + 1}. {question.question}
                </Text>

                {/* IMAGE */}
                {question.question_image_url && (
                  <Image
                    source={{
                      uri: question.question_image_url,
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
                    marginTop: 24,
                  }}>
                  {buildOptions(question).map(
                    (option: any, optionIndex: number) => {
                      const isCorrect = question.correct_option === option.key;

                      const isSelected = item.selected_option === option.key;

                      let backgroundColor = "#F9FAFB";

                      let borderColor = "#E5E7EB";

                      if (isCorrect) {
                        backgroundColor = "#DCFCE7";

                        borderColor = "#10B981";
                      }

                      if (isSelected && !isCorrect) {
                        backgroundColor = "#FEE2E2";

                        borderColor = "#EF4444";
                      }

                      return (
                        <View
                          key={`${option.key}-${optionIndex}`}
                          style={{
                            backgroundColor,
                            borderWidth: 1.5,
                            borderColor,
                            borderRadius: 20,
                            padding: 18,
                            marginBottom: 14,
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "700",
                            }}>
                            {option.key.toUpperCase()}. {option.text}
                          </Text>

                          {option.explanation && (
                            <Text
                              style={{
                                marginTop: 10,
                                fontSize: 13,
                                lineHeight: 22,
                                color: "#667085",
                              }}>
                              {option.explanation}
                            </Text>
                          )}
                        </View>
                      );
                    },
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function buildOptions(question: any) {
  return [
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
  ];
}
