import { supabase } from "@/lib/supabase";

export async function getQuestionsByTest(testId: string) {
  const response = await supabase
    .from("test_questions")
    .select("*")
    .eq("test_id", testId)
    .order("question_order", {
      ascending: true,
    });

  return {
    success: !response.error,

    data: response.data,

    error: response.error,
  };
}

export function shuffleArray(array: any[]) {
  const copied = [...array];

  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copied[i], copied[j]] = [copied[j], copied[i]];
  }

  return copied;
}

export function shuffleQuestions(questions: any[]) {
  const randomizedQuestions = shuffleArray(questions);

  return randomizedQuestions.map((question) => {
    const options = [
      {
        key: "a",
        text: question.option_a,
      },

      {
        key: "b",
        text: question.option_b,
      },

      {
        key: "c",
        text: question.option_c,
      },

      {
        key: "d",
        text: question.option_d,
      },
    ];

    const shuffledOptions = shuffleArray(options);

    return {
      ...question,

      options: shuffledOptions,
    };
  });
}
export async function submitTest({
  testId,
  assignmentId,
  studentId,
  answers,
  questions,
}: {
  testId: string;

  assignmentId?: string;

  studentId: string;

  answers: any;

  questions: any[];
}) {
  // CALCULATE SCORE
  let score = 0;

  const formattedAnswers = questions.map((question) => {
    const selectedOption = answers[question.id];

    const isCorrect = selectedOption === question.correct_option;

    if (isCorrect) {
      score += question.marks || 1;
    }

    return {
      question_id: question.id,

      selected_option: selectedOption || null,

      is_correct: isCorrect,
    };
  });

  // CREATE STUDENT TEST
  const studentTestResponse = await supabase
    .from("student_tests")
    .insert({
      test_id: testId,

      assignment_id: assignmentId || null,

      student_id: studentId,

      score,

      submitted_at: new Date().toISOString(),

      status: "completed",
    })
    .select()
    .single();

  if (studentTestResponse.error) {
    return {
      success: false,

      error: studentTestResponse.error,
    };
  }

  const studentTest = studentTestResponse.data;

  // PREPARE ANSWERS
  const finalAnswers = formattedAnswers.map((answer) => ({
    ...answer,

    student_test_id: studentTest.id,
  }));

  // INSERT ANSWERS
  const answerResponse = await supabase
    .from("student_test_answers")
    .insert(finalAnswers);

  if (answerResponse.error) {
    return {
      success: false,

      error: answerResponse.error,
    };
  }

  return {
    success: true,

    score,
  };
}
