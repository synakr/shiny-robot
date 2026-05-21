import { create } from "zustand";

type UserRole = "teacher" | "student" | null;

type AuthState = {
  user: any | null;
  role: UserRole;

  setUser: (user: any) => void;
  setRole: (role: UserRole) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,

  setUser: (user) =>
    set({
      user,
    }),

  setRole: (role) =>
    set({
      role,
    }),

  logout: () =>
    set({
      user: null,
      role: null,
    }),
}));
