import { supabase } from "@/lib/supabase";

export async function createBatch({
  teacherId,
  batchId,
  batchName,
  className,
  year,
}: {
  teacherId: string;

  batchId: string;

  batchName: string;

  className: string;

  year: string;
}) {
  const response = await supabase.from("batches").insert({
    teacher_id: teacherId,

    batch_id: batchId,

    batch_name: batchName,

    class_name: className,

    year,
  });

  return {
    success: !response.error,

    error: response.error,
  };
}

export async function getBatchesByTeacher(teacherId: string) {
  const response = await supabase
    .from("batches")
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
