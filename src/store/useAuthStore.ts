import { create } from "zustand";
import { UserProfile } from "@/types";

interface AuthState {
  profile: UserProfile | null;
  loading: boolean;
  setProfile: (p: UserProfile | null) => void;
  setLoading: (l: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  loading: true,
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
}));
