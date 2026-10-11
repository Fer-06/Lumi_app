import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  updateProfile, sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Gender, UserProfile } from "@/types";

export class RegistrationProfileError extends Error {
  constructor() {
    super("La cuenta se creó, pero no se pudo guardar el perfil en Firestore.");
    this.name = "RegistrationProfileError";
  }
}

export function getRegistrationErrorMessage(error: unknown) {
  if (error instanceof RegistrationProfileError) {
    return "Tu cuenta sí se creó, pero no se pudo guardar el perfil. Ya puedes iniciar sesión. Si vuelve a fallar, revisa las reglas de Firestore.";
  }

  if (!(error instanceof FirebaseError)) {
    return "No pudimos conectar con Firebase. Revisa tu conexión e inténtalo de nuevo.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "Ese correo ya tiene una cuenta. Inicia sesión o usa la opción para recuperar tu contraseña.";
    case "auth/invalid-email":
      return "El correo no tiene un formato válido. Revísalo e inténtalo de nuevo.";
    case "auth/weak-password":
      return "La contraseña es muy débil. Usa al menos 6 caracteres y prueba con una más segura.";
    case "auth/operation-not-allowed":
      return "Firebase no tiene habilitado el registro con correo y contraseña. Activa el proveedor Correo/contraseña en Authentication.";
    case "auth/unauthorized-domain":
      return "Este dominio no está autorizado para registrarse. Agrégalo a los dominios autorizados en Firebase Authentication.";
    case "auth/network-request-failed":
      return "No se pudo conectar con Firebase. Revisa tu conexión e inténtalo de nuevo.";
    case "auth/too-many-requests":
      return "Hubo demasiados intentos. Espera un momento y vuelve a intentarlo.";
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
    case "auth/invalid-api-key":
      return "La configuración de Firebase no es válida. Revisa las variables NEXT_PUBLIC_FIREBASE del proyecto.";
    case "permission-denied":
    case "firestore/permission-denied":
      return "La cuenta puede haberse creado, pero Firebase bloqueó el guardado del perfil. Revisa las reglas de Firestore.";
    default:
      return `No se pudo completar el registro (${error.code}). Revisa la configuración de Firebase e inténtalo de nuevo.`;
  }
}

export async function registerUser(name: string, email: string, password: string, gender: Gender) {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
  const profile: UserProfile = {
    uid: cred.user.uid,
    name: normalizedName,
    email: normalizedEmail,
    gender,
    notificationsEnabled: false,
    language: "es",
  };

  try {
    await updateProfile(cred.user, { displayName: normalizedName });
    await setDoc(doc(db, "users", cred.user.uid), profile);
  } catch (error) {
    console.error("La cuenta se creó, pero falló el guardado de su perfil:", error);
    throw new RegistrationProfileError();
  }

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
