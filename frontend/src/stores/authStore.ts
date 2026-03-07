import { create } from "zustand";

import { getMeApi } from "@/api/auth";
import type { AuthState, AuthUser } from "@/types/auth";

const clearAuthState = (set: (partial: Partial<AuthState>) => void) => {
  localStorage.removeItem("bsi_token");
  set({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  });
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("bsi_token") : null,
  isAuthenticated: false,
  isLoading: true,
  login: (token: string, user: AuthUser) => {
    localStorage.setItem("bsi_token", token);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },
  logout: () => {
    clearAuthState(set);
    window.location.href = "/login";
  },
  initializeAuth: async () => {
    const token = localStorage.getItem("bsi_token");

    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true, token });

    try {
      const user = await getMeApi();

      if (!user) {
        clearAuthState(set);
        return;
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      clearAuthState(set);
    }
  },
}));
