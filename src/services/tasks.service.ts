import {
  collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task } from "@/types";

const tasksCol = collection(db, "tasks");

export function subscribeToTasks(userId: string, cb: (tasks: Task[]) => void) {
  const q = query(tasksCol, where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    cb(
  snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Task, "id">) }))
    .sort((a, b) => a.date.localeCompare(b.date)),
);
  });
}

export async function createTask(
  task: Omit<Task, "id">,
  userId: string
) {
  return addDoc(tasksCol, {
    ...task,
    userId
  });
}
export async function updateTask(id: string, data: Partial<Task>) {
  return updateDoc(doc(db, "tasks", id), data);
}

export async function deleteTask(id: string) {
  return deleteDoc(doc(db, "tasks", id));
}

export async function duplicateTask(task: Task) {
  const { id, ...rest } = task;

  return addDoc(tasksCol, {
    ...rest,
    title: `${rest.title} (copia)`,
    userId: task.userId
  });
}
