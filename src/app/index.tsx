import { Redirect } from "expo-router";

import { useAuthStore } from "@/store/authStore";

export default function Index() {
  const { user, role } = useAuthStore();

  // Not Logged In
  if (!user) {
    return <Redirect href="/auth/role-select" />;
  }

  // Teacher
  if (role === "teacher") {
    return <Redirect href="/teacher/dashboard" />;
  }

  // Student
  if (role === "student") {
    return <Redirect href="/auth/role-select" />;
  }

  return <Redirect href="/auth/role-select" />;
}
