import { create } from "zustand";

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

  auth_id: string;

  student_name: string;

  email: string;

  phone: string;

  class_name: string;

  batch_name: string;

  batch_id: string;

  batch_category: string;

  year: string;

  enrollment_id: string;

  payment_status: string;

  attendance: number;

  tasks_completed: number;

  performance_score: number;

  rank: number;
};

type AuthState = {
  user: any | null;

  role: UserRole;

  teacher: TeacherProfile | null;

  student: StudentProfile | null;

  setUser: (user: any) => void;

  setRole: (role: UserRole) => void;

  setTeacher: (teacher: TeacherProfile | null) => void;

  setStudent: (student: StudentProfile | null) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
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
}));
