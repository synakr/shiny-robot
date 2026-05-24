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

  targetType,

  className,

  batchId,

  batchName,

  batchCategory,

  year,

  totalMarks,

  attachmentUrl,

  dueDate,
}: {
  teacherId: string;

  title: string;

  description: string;

  targetType: string;

  className?: string;

  batchId?: string;

  batchName?: string;

  batchCategory?: string;

  year?: string;

  totalMarks?: number;

  attachmentUrl?: string;

  dueDate?: string;
}) {
  const response = await supabase.from("tasks").insert({
    teacher_id: teacherId,

    title,

    description,

    target_type: targetType,

    class_name: className || null,

    batch_id: batchId || null,

    batch_name: batchName || null,

    batch_category: batchCategory || null,

    year: year || null,

    total_marks: totalMarks || null,

    attachment_url: attachmentUrl || null,

    due_date: dueDate || null,
  });

  return {
    success: !response.error,

    error: response.error,
  };
}
