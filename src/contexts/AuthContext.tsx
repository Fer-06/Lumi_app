"use client";

import { createContext, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getUserProfile } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setProfile = useAuthStore((s) => s.setProfile);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let profile = await getUserProfile(user.uid);

        if (!profile) {
          profile = {
            uid: user.uid,
            name: user.displayName ?? "",
            email: user.email ?? "",
            notificationsEnabled: false,
            language: "es",
          };
          await setDoc(doc(db, "users", user.uid), profile, { merge: true });
        }

        setProfile(profile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [setProfile, setLoading]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
