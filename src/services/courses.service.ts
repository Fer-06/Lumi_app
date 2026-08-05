import {
  collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course } from "@/types";

const coursesCol = collection(db, "courses");

export function subscribeToCourses(userId: string, cb: (courses: Course[]) => void) {
  const q = query(coursesCol, where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Course, "id">) })));
  });
}

export async function createCourse(course: Omit<Course, "id">) {
  return addDoc(coursesCol, course);
}

export async function updateCourse(id: string, data: Partial<Course>) {
  return updateDoc(doc(db, "courses", id), data);
}

export async function deleteCourse(id: string) {
  return deleteDoc(doc(db, "courses", id));
}
