import { supabase } from "@/lib/supabase";

export async function assignTest({
  testId,
  teacherId,
  title,
  targetType,
  batchName,
  batchId,
  batchCategory,
  className,
  year,
}: {
  testId: string;

  teacherId: string;

  title?: string;

  targetType: string;

  batchName?: string;

  batchId?: string;

  batchCategory?: string;

  className?: string;

  year?: string;
}) {
  const response = await supabase
    .from("test_assignments")
    .insert({
      test_id: testId,

      teacher_id: teacherId,

      title,

      target_type: targetType,

      batch_name: batchName,

      batch_id: batchId,

      batch_category: batchCategory,

      class_name: className,

      year,
    })
    .select()
    .single();

  return {
    success: !response.error,

    data: response.data,

    error: response.error,
  };
}
