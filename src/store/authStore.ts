import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

type UserRole = "teacher" | "student" | null;

type TeacherProfile = {
  id: string;
  auth_id: string;
  teacher_name: string;
  institute_name: string;
  email: string;
  primary_color: string;
};

type StudentProfile = {
  id: string;
  teacher_id: string | null;
  auth_id: string | null;

  student_name: string;
  email: string | null;
  phone: string | null;
  parent_phone: string | null;

  class_name: string | null;
  batch_name: string | null;
  batch_id: string | null;
  batch_category: string | null;
  year: string | null;
  enrollment_id: string | null;

  payment_status: string | null;
  attendance: number | null;
  tasks_completed: number | null;
  performance_score: number | null;
  rank: number | null;
};

type AuthState = {
  user: any | null;

  role: UserRole;

  teacher: TeacherProfile | null;

  student: StudentProfile | null;

  setUser: (user: any | null) => void;

  setRole: (role: UserRole) => void;

  setTeacher: (teacher: TeacherProfile | null) => void;

  setStudent: (student: StudentProfile | null) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      role: null,

      teacher: null,

      student: null,

      setUser: (user) =>
        set({
          user,
        }),

      setRole: (role) =>
        set({
          role,
        }),

      setTeacher: (teacher) =>
        set({
          teacher,
        }),

      setStudent: (student) =>
        set({
          student,
        }),

      logout: () =>
        set({
          user: null,
          role: null,
          teacher: null,
          student: null,
        }),
    }),

    {
      name: "auth-storage",

      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        user: state.user,
        role: state.role,
        teacher: state.teacher,
        student: state.student,
      }),
    },
  ),
);