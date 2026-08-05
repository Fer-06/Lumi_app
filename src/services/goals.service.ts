import {
  collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Goal } from "@/types";

const goalsCol = collection(db, "goals");

export function subscribeToGoals(userId: string, cb: (goals: Goal[]) => void) {
  const q = query(goalsCol, where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Goal, "id">) })));
  });
}

export async function createGoal(goal: Omit<Goal, "id">) {
  return addDoc(goalsCol, goal);
}

export async function updateGoal(id: string, data: Partial<Goal>) {
  return updateDoc(doc(db, "goals", id), data);
}

export async function deleteGoal(id: string) {
  return deleteDoc(doc(db, "goals", id));
}
