import { supabase } from "@/lib/supabase";

export async function getPlaylistsForStudent(student: any) {
  const response = await supabase
    .from("playlists")
    .select("*")
    .eq("teacher_id", student.teacher_id)
    .eq("batch_id", student.batch_id)
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  return {
    success: !response.error,

    data: response.data,

    error: response.error,
  };
}
