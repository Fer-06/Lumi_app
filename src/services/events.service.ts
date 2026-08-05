import {
  collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CalendarEvent } from "@/types";

const eventsCol = collection(db, "events");

export function subscribeToEvents(userId: string, cb: (events: CalendarEvent[]) => void) {
  const q = query(eventsCol, where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CalendarEvent, "id">) })));
  });
}

export async function createEvent(event: Omit<CalendarEvent, "id">) {
  return addDoc(eventsCol, event);
}

export async function updateEvent(id: string, data: Partial<CalendarEvent>) {
  return updateDoc(doc(db, "events", id), data);
}

export async function deleteEvent(id: string) {
  return deleteDoc(doc(db, "events", id));
}
