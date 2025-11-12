"use client";

import { ActiveUserChat } from "@/app/chat/page";
import { Message } from "@/app/types/chat";
import { useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import MessageItem from "./MessageItem";

const ActiveChatWindow = () => {
  const { otherUser, activeChat } = useContext(ActiveUserChat)!;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showHeaderOptions, setShowHeaderOptions] = useState(false);

  const handleDeleteChat = () => {
    fetch(`/chat/${activeChat?.id}`, { method: "DELETE" })
      .then(() => {
        setMessages([]);
        setShowHeaderOptions(false);
      })
      .catch(console.error);
  };

  const handleDeleteMessage = (messageId: string) => {
    fetch(`/message/${messageId}`, { method: "DELETE" })
      .then(() => {
        setMessages((pervMessages) =>
          pervMessages.filter((msg) => msg.id !== messageId)
        );

        socketRef.current?.emit("removeMessage", {
          messageId,
          chat_id: activeChat?.id,
        });

        setShowHeaderOptions(false);
      })
      .catch(console.error);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!activeChat || !socketRef.current) return;
    const currentUser =
      activeChat.user1.id === otherUser?.id
        ? activeChat.user2.first_name + " " + activeChat.user2.last_name
        : activeChat.user1.first_name + " " + activeChat.user1.last_name;

    socketRef.current.emit("UserJoin", currentUser, activeChat.id);

    fetch(`/message/${activeChat.id}`)
      .then((result) => result.json())
      .then((data) => setMessages(data.data));

    const handleReceive = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    socketRef.current.on("receiveMessage", handleReceive);
    socketRef.current.on("removedMessage", handleDeleteMessage);

    return () => {
      socketRef.current?.off("receiveMessage", handleReceive);
      socketRef.current?.off("removedMessage", handleDeleteMessage);
    };
  }, [activeChat?.id]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socketRef.current || !activeChat?.id) return;

    const sender_id: string =
      otherUser?.id === activeChat.user1_id
        ? activeChat.user2_id
        : activeChat.user1_id;

    fetch("/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: newMessage,
        sender_id,
        chat_id: activeChat.id,
        content_type: "text",
      }),
    })
      .then((res) => res.json())
      .then(({ data }) => {
        socketRef.current?.emit("sendMessage", {
          messageId: data?.id,
          chat_id: data.chat_id,
          content: data.content,
          sender_id: data.sender_id,
          created_at: data.created_at,
        });

        setNewMessage("");
      })
      .catch(console.error);
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!otherUser)
    return (
      <div className="flex flex-col h-full items-center justify-center text-center text-gray-400 px-4 gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          className="w-12 h-12"
        >
          <defs>
            <linearGradient id="sendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <path
            fill="url(#sendGradient)"
            d="M64 304C64 358.4 83.3 408.6 115.9 448.9L67.1 538.3C65.1 542 64 546.2 64 550.5C64 564.6 75.4 576 89.5 576C93.5 576 97.3 575.4 101 573.9L217.4 524C248.8 536.9 283.5 544 320 544C461.4 544 576 436.5 576 304C576 171.5 461.4 64 320 64C178.6 64 64 171.5 64 304zM158 471.9C167.3 454.8 165.4 433.8 153.2 418.7C127.1 386.4 112 346.8 112 304C112 200.8 202.2 112 320 112C437.8 112 528 200.8 528 304C528 407.2 437.8 496 320 496C289.8 496 261.3 490.1 235.7 479.6C223.8 474.7 210.4 474.8 198.6 479.9L140 504.9L158 471.9zM208 336C225.7 336 240 321.7 240 304C240 286.3 225.7 272 208 272C190.3 272 176 286.3 176 304C176 321.7 190.3 336 208 336zM352 304C352 286.3 337.7 272 320 272C302.3 272 288 286.3 288 304C288 321.7 302.3 336 320 336C337.7 336 352 321.7 352 304zM432 336C449.7 336 464 321.7 464 304C464 286.3 449.7 272 432 272C414.3 272 400 286.3 400 304C400 321.7 414.3 336 432 336z"
          />
        </svg>
        <h1 className="text-xl font-semibold text-black">
          Select a conversation
        </h1>
        <p className="text-sm -mt-2 text-gray-700">
          Choose a contact from the sidebar to start chatting
        </p>
      </div>
    );

  return (
    <div className="w-full flex flex-col  h-[90vh]">
      <div className="w-full  px-3 flex justify-between h-16 py-2 border-b border-gray-100">
        <div className=" flex items-center gap-3 ">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={
              otherUser?.profil_picture ||
              "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
            }
          />

          <div className="flex flex-col">
            <h1 className="text-[16px] font-semibold">{`${otherUser?.first_name}${otherUser?.last_name}`}</h1>
            <p className="text-sm lowercase -mt-1 text-gray-400">
              {otherUser?.role}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowHeaderOptions(!showHeaderOptions)}
            className="p-2 rounded-full mt-2 hover:bg-gray-100 transition"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              <path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z" />
            </svg>
          </button>

          {showHeaderOptions && (
            <ul className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 shadow-lg rounded-md z-10">
              <li>
                <button
                  onClick={handleDeleteChat}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                >
                  Delete Chat
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="flex-1 bg-gray-100 p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {messages.map((message) => {
          const isSender = message.sender_id !== otherUser.id;
          return (
            <MessageItem
              key={message.id}
              message={message}
              isSender={isSender}
              onDelete={(id) => handleDeleteMessage(id)}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full px-4 py-3 border-t border-gray-200 bg-white flex gap-3 items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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

export default ActiveChatWindow;
