"use client";
import { ActiveUserChat } from "@/app/chat/page";
import { Chat, UserInfo } from "@/app/types/chat";
import { useContext, useEffect, useState } from "react";

const userId: string = "24aa37c7-1f98-4926-83f2-d3a121e39d4d";

const Sidebar = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const { activeChat, setActiveChat } = useContext(ActiveUserChat)!;

  useEffect(() => {
    fetch(`/user/${userId}`)
      .then((result) => result.json())
      .then((data) => setUser(data.data));

    fetch(`/chat/${userId}`)
      .then((result) => result.json())
      .then((data) => setChats(data.data));
  }, []);
  return (
    <aside className="w-80 bg-white border-r h-[90vh] border-gray-200  flex flex-col">
      <div className="px-4 py-3 flex items-center gap-2 bg-gradient-to-r from-[#9333EA] to-[#2563EB]">
        <img
          className="h-10 w-10 rounded-full object-cover border-2 border-white"
          src={
            user?.profil_picture ||
            "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
          }
        ></img>
        <h2 className="text-lg font-medium text-white">Messages</h2>
      </div>

      {/* search bar */}
      <div className="w-full px-4 py-3 border-b border-gray-100 bg-white flex justify-center">
        <input
          type="text"
          placeholder="Search users..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9333EA]"
        />
      </div>

      {/* users */}
      <div className="overflow-y-auto">
        {chats?.length > 0 &&
          chats?.map((chat) => {
            const otherUser =
              chat.user1_id === userId ? chat.user2 : chat.user1;
            const activeChatUser = activeChat?.id === chat.id;
            const chatId = chat.id;
            return (
              <div
                onClick={() => {
                  setActiveChat(chat, otherUser);
                }}
                key={chatId}
                className={`relative flex gap-2 items-center bg-transparent  ${
                  activeChatUser &&
                  "bg-gradient-to-r from-[#9333EA]/10 to-[#2563EB]/10"
                } py-3 px-4`}
              >
                <div
                  className={`absolute flex gap-2 left-0 top-0 h-full w-1 ${
                    activeChatUser &&
                    "bg-gradient-to-b from-[#9333EA] to-[#2563EB]"
                  } rounded-l-full`}
                ></div>
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={
                    otherUser.profil_picture ||
                    "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
                  }
                />

                <div className="flex flex-col">
                  <h1 className="text-[16px] font-semibold">{`${otherUser?.first_name}${otherUser?.last_name}`}</h1>
                  <p className="text-sm text-gray-400 truncate max-w-[250px]">
                    {chat?.messages?.[0]?.content || ""}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </aside>
  );
};

export default Sidebar;
