import {
  collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DiaryEntry } from "@/types";

const diaryCol = collection(db, "diaryEntries");

export function subscribeToDiary(userId: string, cb: (entries: DiaryEntry[]) => void) {
  const q = query(diaryCol, where("userId", "==", userId),);
  return onSnapshot(q, (snap) => {
    cb(
  snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<DiaryEntry, "id">) }))
    .sort((a, b) => b.date.localeCompare(a.date)),
);
  });
}

export async function createDiaryEntry(entry: Omit<DiaryEntry, "id">) {
  return addDoc(diaryCol, entry);
}

export async function updateDiaryEntry(id: string, data: Partial<DiaryEntry>) {
  return updateDoc(doc(db, "diaryEntries", id), data);
}

export async function deleteDiaryEntry(id: string) {
  return deleteDoc(doc(db, "diaryEntries", id));
}
