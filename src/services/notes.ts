import { supabase } from "@/lib/supabase";

export async function createNote({
  teacherId,
  title,
  description,
  fileName,
  fileUrl,
  targetType,
  batchId,
  batchName,
  batchCategory,
  className,
  year,
}: {
  teacherId: string;

  title: string;

  description: string;

  fileName: string;

  fileUrl: string;

  targetType: string;

  batchId?: string;

  batchName?: string;

  batchCategory?: string;

  className?: string;

  year?: string;
}) {
  const response = await supabase.from("notes").insert({
    teacher_id: teacherId,

    title,

    description,

    file_name: fileName,

    file_url: fileUrl,

    target_type: targetType,

    batch_id: batchId,

    batch_name: batchName,

    batch_category: batchCategory,

    class_name: className,

    year,
  });

  return {
    success: !response.error,

    error: response.error,
  };
}

export async function getNotesByTeacher(teacherId: string) {
  const response = await supabase
    .from("notes")
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

export async function getNotesForStudent(batchName: string) {
  const response = await supabase
    .from("notes")
    .select("*")
    .or(`target_type.eq.all,batch_name.eq.${batchName}`)
    .order("created_at", {
      ascending: false,
    });

  return {
    success: !response.error,
    data: response.data,
    error: response.error,
  };
}
