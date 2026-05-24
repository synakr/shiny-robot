import { supabase } from "@/lib/supabase";

export async function createTest({
  teacherId,
  title,
  description,
  durationMinutes,
  targetType,
  batchName,
  batchId,
  batchCategory,
  className,
  year,
  questions,
}: {
  teacherId: string;

  title: string;

  description?: string;

  durationMinutes?: number;

  targetType: string;

  batchName?: string;

  batchId?: string;

  batchCategory?: string;

  className?: string;

  year?: string;

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

      target_type: targetType,

      batch_name: batchName,

      batch_id: batchId,

      batch_category: batchCategory,

      class_name: className,

      year,

      status: "published",
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

  // PREPARE QUESTIONS
  const formattedQuestions = questions.map((question) => ({
    ...question,

    test_id: test.id,
  }));

  // INSERT QUESTIONS
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
