import { supabase } from "@/lib/supabase";

export async function teacherLogin(email: string, password: string) {
  const loginResponse = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginResponse.error) {
    return {
      success: false,
      error: loginResponse.error.message,
    };
  }

  return {
    success: true,
    data: loginResponse.data,
  };
}
