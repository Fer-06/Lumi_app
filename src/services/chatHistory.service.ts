import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChatMessage } from "@/types";

export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
}

const conversationsCol = collection(db, "chatConversations");
const messagesCol = collection(db, "chatMessages");

export function subscribeToChatConversations(
  userId: string,
  onChange: (conversations: ChatConversation[]) => void,
  onError: (error: Error) => void,
) {
  const conversationsQuery = query(conversationsCol, where("userId", "==", userId));
  return onSnapshot(
    conversationsQuery,
    (snapshot) => {
      const conversations = snapshot.docs
        .map((snapshotDoc) => ({
          id: snapshotDoc.id,
          ...(snapshotDoc.data() as Omit<ChatConversation, "id">),
        }))
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
      onChange(conversations);
    },
    onError,
  );
}

export function subscribeToChatMessages(
  userId: string,
  conversationId: string,
  onChange: (messages: ChatMessage[]) => void,
  onError: (error: Error) => void,
) {
  const messagesQuery = query(
    messagesCol,
    where("userId", "==", userId),
    where("conversationId", "==", conversationId),
  );
  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messages = snapshot.docs
        .map((snapshotDoc) => ({
          id: snapshotDoc.id,
          ...(snapshotDoc.data() as Omit<ChatMessage, "id">),
        }))
        .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
      onChange(messages);
    },
    onError,
  );
}

export async function createChatConversation(
  userId: string,
  title: string,
  firstMessage: ChatMessage,
) {
  const conversationRef = doc(conversationsCol);
  const messageRef = doc(messagesCol);
  const timestamp = firstMessage.createdAt;
  const batch = writeBatch(db);

  batch.set(conversationRef, {
    userId,
    title,
    preview: firstMessage.text,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  batch.set(messageRef, {
    ...firstMessage,
    userId,
    conversationId: conversationRef.id,
  });

  await batch.commit();
  return {
    id: conversationRef.id,
    userId,
    title,
    preview: firstMessage.text,
    createdAt: timestamp,
    updatedAt: timestamp,
  } satisfies ChatConversation;
}

export async function saveChatMessage(
  userId: string,
  conversationId: string,
  message: ChatMessage,
) {
  const messageRef = doc(messagesCol);
  const conversationRef = doc(conversationsCol, conversationId);
  const batch = writeBatch(db);

  batch.set(messageRef, {
    ...message,
    userId,
    conversationId,
  });
  batch.update(conversationRef, {
    preview: message.text,
    updatedAt: message.createdAt,
  });

  await batch.commit();
}

export async function deleteChatConversation(userId: string, conversationId: string) {
  const conversationRef = doc(conversationsCol, conversationId);
  const conversationSnapshot = await getDoc(conversationRef);
  if (!conversationSnapshot.exists() || conversationSnapshot.data().userId !== userId) {
    throw new Error("No se encontró esa conversación en tu historial.");
  }

  const conversationMessages = query(
    messagesCol,
    where("userId", "==", userId),
    where("conversationId", "==", conversationId),
    limit(450),
  );

  while (true) {
    const snapshot = await getDocs(conversationMessages);
    if (snapshot.empty) break;

    const batch = writeBatch(db);
    snapshot.docs.forEach((message) => batch.delete(message.ref));
    await batch.commit();
  }

  await deleteDoc(conversationRef);
}
