import { supabase } from "@/lib/supabase";

export async function getAnnouncementsForStudent(student: any) {
  const response = await supabase
    .from("announcements")
    .select("*")
    .eq("teacher_id", student.teacher_id)
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
