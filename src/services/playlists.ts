import { supabase } from "@/lib/supabase";

export async function createPlaylist({
  teacherId,
  title,
  description,
  playlistUrl,
  thumbnailUrl,
  targetType,
  batchId,
  batchName,
  batchCategory,
  className,
  year,
}: {
  teacherId: string;

  title: string;

  description?: string;

  playlistUrl: string;

  thumbnailUrl?: string;

  targetType: string;

  batchId?: string;

  batchName?: string;

  batchCategory?: string;

  className?: string;

  year?: string;
}) {
  const response = await supabase.from("playlists").insert({
    teacher_id: teacherId,

    title,

    description,

    playlist_url: playlistUrl,

    thumbnail_url: thumbnailUrl,

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

export async function getPlaylistsByTeacher(teacherId: string) {
  const response = await supabase
    .from("playlists")
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

export async function getPlaylistsForStudent(student: any) {
  const response = await supabase
    .from("playlists")
    .select("*")
    .eq("teacher_id", student.teacher_id)
    .eq("is_active", true)
    .or(
      [
        "target_type.eq.all",

        `and(target_type.eq.batch,batch_name.eq.${student.batch_name})`,

        `and(target_type.eq.class,class_name.eq.${student.class_name})`,

        `and(target_type.eq.category,batch_category.eq.${student.batch_category})`,
      ].join(","),
    )
    .order("created_at", {
      ascending: false,
    });

  return {
    success: !response.error,

    data: response.data,

    error: response.error,
  };
}
