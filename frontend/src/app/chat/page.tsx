"use client"
import Sidebar from "@/app/components/chat/Sidebar";
import { createContext, useState } from "react";
import { ActiveChat, Chat, UserInfo } from "../types/chat";
import ActiveChatWindow from "../components/chat/ActiveChatWindow";

export const ActiveUserChat = createContext<ActiveChat|null>(null);

export default function ChatPage() {
  const [activeChat, setActiveChatState] = useState<{
    otherUser: UserInfo | null;
    activeChat: Chat | null;
  }>({ otherUser: null, activeChat: null });

  const setActiveChat = (activeChat: Chat, user: UserInfo) => {
    setActiveChatState({ activeChat, otherUser: user });
  };

  return (
    <ActiveUserChat.Provider value={{...activeChat,setActiveChat}}>
      <div className="flex justify-between w-full overflow-hidden">
        <div className="w-[320px] shrink-0 border-r border-gray-200 bg-white">
          <Sidebar />
        </div>

        <div className="flex-1 ">
          <ActiveChatWindow />
        </div>
      </div>
    </ActiveUserChat.Provider>
  );
}
