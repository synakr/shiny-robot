import { supabase } from "@/lib/supabase";

export async function getCurrentTeacher(authId: string) {
  const response = await supabase.from("teachers").select("*");

  console.log("SUPABASE RESPONSE:", response);

  const teacher = response.data?.find(
    (item: any) => String(item.auth_id).trim() === String(authId).trim(),
  );

  console.log("AUTH ID:", authId);

  console.log("FOUND TEACHER:", teacher);

  if (!teacher) {
    return {
      success: false,
      error: "Teacher not found",
    };
  }

  return {
    success: true,
    data: teacher,
  };
}
