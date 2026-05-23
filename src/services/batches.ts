import { supabase } from "@/lib/supabase";

export async function createBatch({
  teacherId,
  batchId,
  batchName,
  batchCategory,
  batchNumber,
  className,
  year,
  admissionOpen,
}: {
  teacherId: string;

  batchId: string;

  batchName: string;

  batchCategory: string;

  batchNumber: string;

  className: string;

  year: string;

  admissionOpen: boolean;
}) {
  const response = await supabase.from("batches").insert({
    teacher_id: teacherId,

    batch_id: batchId,

    batch_name: batchName,

    batch_category: batchCategory,

    batch_number: batchNumber,

    class_name: className,

    year,

    admission_open: admissionOpen,
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
