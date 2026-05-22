import { supabase } from "@/lib/supabase";

export async function getStudentsByTeacher(teacherId: string) {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    data,
  };
}
