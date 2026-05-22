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
  batchName,
}: {
  teacherId: string;

  title: string;

  message: string;

  batchName: string;
}) {
  const response = await supabase.from("announcements").insert({
    teacher_id: teacherId,

    title,

    message,

    batch_name: batchName,
  });

  return {
    success: !response.error,

    error: response.error,
  };
}
