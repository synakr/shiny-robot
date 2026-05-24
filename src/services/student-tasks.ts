import { supabase } from "@/lib/supabase";

export async function getTasksForStudent(student: {
  batch_id?: string;
  batch_category?: string;
  class_name?: string;
}) {
  const response = await supabase
    .from("tasks")
    .select("*")
    .eq("status", "active")
    .or(
      [
        "target_type.eq.all",

        `and(target_type.eq.batch,batch_id.eq.${student.batch_id})`,

        `and(target_type.eq.category,batch_category.eq.${student.batch_category})`,

        `and(target_type.eq.class,class_name.eq.${student.class_name})`,
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
