import { useEffect } from "react";

import { Stack, router } from "expo-router";

import { supabase } from "@/lib/supabase";

import { useAuthStore } from "@/store/authStore";

export default function RootLayout() {
  useEffect(() => {
    async function restoreSession() {
      const { data } = await supabase.auth.getSession();

      const user = data.session?.user;

      if (!user) return;

      const { setUser, setRole, setTeacher, setStudent } =
        useAuthStore.getState();

      setUser(user);

      const teacherResponse = await supabase
        .from("teachers")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle();

      if (teacherResponse.data) {
        setRole("teacher");

        setTeacher(teacherResponse.data);

        router.replace("/teacher/dashboard");

        return;
      }

      const studentResponse = await supabase
        .from("students")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle();

      if (studentResponse.data) {
        setRole("student");

        setStudent(studentResponse.data);

router.replace("/student/home" as any);
        return;
      }
    }

    restoreSession();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}