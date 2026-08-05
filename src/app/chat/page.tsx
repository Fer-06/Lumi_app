"use client";

import { Header } from "@/components/layout/Header";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ChatPage() {
  return (
    <div className="px-5 lg:px-8">
      <Header />
      <ChatWindow />
    </div>
  );
}
