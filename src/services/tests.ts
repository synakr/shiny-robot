import { supabase } from "@/lib/supabase";

export async function createTest({
  teacherId,
  title,
  description,
  durationMinutes,
  questions,
}: {
  teacherId: string;

  title: string;

  description?: string;

  durationMinutes?: number;

  questions: any[];
}) {
  // CREATE TEST
  const testResponse = await supabase
    .from("tests")
    .insert({
      teacher_id: teacherId,

      title,

      description,

      duration_minutes: durationMinutes || 60,

      total_questions: questions.length,

      total_marks: questions.length,
    })
    .select()
    .single();

  if (testResponse.error) {
    return {
      success: false,

      error: testResponse.error,
    };
  }

  const test = testResponse.data;

  // INSERT QUESTIONS
  const formattedQuestions = questions.map((question) => ({
    ...question,

    test_id: test.id,
  }));

  const questionResponse = await supabase
    .from("test_questions")
    .insert(formattedQuestions);

  if (questionResponse.error) {
    return {
      success: false,

      error: questionResponse.error,
    };
  }

  return {
    success: true,

    data: test,
  };
}

export async function getTestsByTeacher(teacherId: string) {
  const response = await supabase
    .from("tests")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", {
      ascending: false,
    });

  return {
    success: !response.error,

    data: response.data,

    error: response.error,
  };
}
