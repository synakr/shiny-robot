import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function IndexScreen() {
  const { role, teacher, student } = useAuthStore();

  if (role === "teacher" && teacher) {
    return <Redirect href="/teacher/dashboard" />;
  }

  if (role === "student" && student) {
    return <Redirect href="/student/(tabs)/home" />;
  }

  return <Redirect href="/auth/role-select" />;
}
