import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  updateProfile, sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserProfile } from "@/types";

export async function registerUser(name: string, email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  const profile: UserProfile = {
    uid: cred.user.uid,
    name,
    email,
    notificationsEnabled: false,
    language: "es",
  };
  await setDoc(doc(db, "users", cred.user.uid), profile);
  return cred.user;
}

export async function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function saveUserProfile(uid: string, data: Partial<UserProfile>) {
  if (data.name && auth.currentUser && auth.currentUser.uid === uid) {
    await updateProfile(auth.currentUser, { displayName: data.name });
  }

  return setDoc(doc(db, "users", uid), data, { merge: true });
}
