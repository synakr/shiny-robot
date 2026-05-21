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

type AuthState = {
  user: any | null;

  role: UserRole;

  teacher: TeacherProfile | null;

  setUser: (user: any) => void;

  setRole: (role: UserRole) => void;

  setTeacher: (teacher: TeacherProfile | null) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  role: null,

  teacher: null,

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

  logout: () =>
    set({
      user: null,
      role: null,
      teacher: null,
    }),
}));
