import { supabase } from "@/lib/supabase";

export async function getCurrentTeacher(authId: string) {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("auth_id", authId)
    .single();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    data,
  };
}
