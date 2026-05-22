import { supabase } from "@/lib/supabase";

export async function getTasksByTeacher(teacherId: string) {
  const response = await supabase
    .from("tasks")
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

export async function createTask({
  teacherId,
  title,
  description,
  className,
  batchName,
  dueDate,
}: {
  teacherId: string;

  title: string;

  description: string;

  className: string;

  batchName: string;

  dueDate: string;
}) {
  const response = await supabase.from("tasks").insert({
    teacher_id: teacherId,

    title,

    description,

    class_name: className,

    batch_name: batchName,

    due_date: dueDate || null,
  });

  return {
    success: !response.error,

    error: response.error,
  };
}
