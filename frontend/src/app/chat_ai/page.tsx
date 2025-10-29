"use client";

import { Message } from "@/app/types/chat";
import { useEffect, useState } from "react";
import ChatMessage from "../components/chat/ChatMessage";

const ChatWithAI = () => {
  const chatId = "3b07a6e2-50a7-4ca0-a781-f82ee0d5ed3c";
  const userId = "24aa37c7-1f98-4926-83f2-d3a121e39d4d";

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/message/${chatId}`);
      const data = await res.json();
      console.log("Fetched Messages:", data);
      setMessages(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("/sendMessageToAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          user_id: userId,
          chat_id: chatId,
        }),
      });

      const { data } = await res.json();

      setMessages((prev) => [...prev, data]);

      setNewMessage("");

      await fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full flex flex-col h-[90vh]">
      <div className="flex-1 bg-gray-100 p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
      </div>

      <div className="w-full px-4 py-3 border-t border-gray-200 bg-white flex gap-3 items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9333EA]/50 text-sm"
        />
        <div
          onClick={handleSendMessage}
          className="p-2 rounded-full text-white bg-gradient-to-r from-[#9333EA] to-[#2563EB] hover:opacity-90 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#ffffff"
            viewBox="0 0 640 640"
            className="w-5 h-5"
          >
            <path d="M568.4 37.7C578.2 34.2 589 36.7 596.4 44C603.8 51.3 606.2 62.2 602.7 72L424.7 568.9C419.7 582.8 406.6 592 391.9 592C377.7 592 364.9 583.4 359.6 570.3L295.4 412.3C290.9 401.3 292.9 388.7 300.6 379.7L395.1 267.3C400.2 261.2 399.8 252.3 394.2 246.7C388.6 241.1 379.6 240.7 373.6 245.8L261.2 340.1C252.1 347.7 239.6 349.7 228.6 345.3L70.1 280.8C57 275.5 48.4 262.7 48.4 248.5C48.4 233.8 57.6 220.7 71.5 215.7L568.4 37.7z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ChatWithAI;
