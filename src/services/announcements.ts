import { supabase } from "@/lib/supabase";

export async function getAnnouncementsByTeacher(teacherId: string) {
  const response = await supabase
    .from("announcements")
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

export async function createAnnouncement({
  teacherId,

  title,

  message,

  targetType,

  batchId,

  batchName,

  batchCategory,

  className,

  year,
}: {
  teacherId: string;

  title: string;

  message: string;

  targetType: string;

  batchId?: string;

  batchName?: string;

  batchCategory?: string;

  className?: string;

  year?: string;
}) {
  const response = await supabase.from("announcements").insert({
    teacher_id: teacherId,

    title,

    message,

    target_type: targetType,

    batch_id: batchId || null,

    batch_name: batchName || null,

    batch_category: batchCategory || null,

    class_name: className || null,

    year: year || null,
  });

  return {
    success: !response.error,

    error: response.error,
  };
}
