import { supabase } from "@/lib/supabase";

export async function getAssignmentsForStudent({ student }: { student: any }) {
  let query = supabase
    .from("test_assignments")
    .select(
      `
      *,
      tests (
        id,
        title,
        description,
        duration_minutes,
        total_questions,
        total_marks
      )
    `,
    )
    .eq("status", "published");

  // ALL
  query = query.or(`
      target_type.eq.all,
      batch_id.eq.${student.batch_id},
      class_name.eq.${student.class_name},
      batch_category.eq.${student.batch_category}
    `);

  const response = await query.order("created_at", {
    ascending: false,
  });

  return {
    success: !response.error,

    data: response.data,

    error: response.error,
  };
}
