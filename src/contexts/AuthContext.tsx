"use client";

import { createContext, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getUserProfile } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { UserProfile } from "@/types";

const AuthContext = createContext(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setProfile = useAuthStore((s) => s.setProfile);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (!user) {
          setProfile(null);
          return;
        }

        let profile = await getUserProfile(user.uid);

        if (!profile) {
          const newProfile: UserProfile = {
            uid: user.uid,
            name: user.displayName ?? "",
            email: user.email ?? "",
            gender: "neutral",
            notificationsEnabled: false,
            language: "es",
          };
          await setDoc(doc(db, "users", user.uid), newProfile, { merge: true });
          profile = newProfile;
        } else if (!profile.gender) {
          profile = { ...profile, gender: "neutral" };
          try {
            await setDoc(doc(db, "users", user.uid), { gender: "neutral" }, { merge: true });
          } catch (error) {
            console.error("No se pudo guardar el lenguaje neutral predeterminado:", error);
          }
        }

        setProfile(profile);
      } catch (error) {
        console.error("No se pudo sincronizar el perfil de la cuenta:", error);
        if (user) {
          setProfile({
            uid: user.uid,
            name: user.displayName ?? "",
            email: user.email ?? "",
            gender: "neutral",
            notificationsEnabled: false,
            language: "es",
          });
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [setProfile, setLoading]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
