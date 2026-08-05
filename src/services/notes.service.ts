import {
  collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QuickNote } from "@/types";

const notesCol = collection(db, "quickNotes");

export function subscribeToNotes(userId: string, cb: (notes: QuickNote[]) => void) {
  const q = query(notesCol, where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<QuickNote, "id">) })));
  });
}

export async function createNote(note: Omit<QuickNote, "id">) {
  return addDoc(notesCol, note);
}

export async function updateNote(id: string, data: Partial<QuickNote>) {
  return updateDoc(doc(db, "quickNotes", id), data);
}

export async function deleteNote(id: string) {
  return deleteDoc(doc(db, "quickNotes", id));
}
