import { Message } from "@/app/types/chat";
import { useState } from "react";

interface MessageItemProps {
  message: Message;
  isSender: boolean;
  onDelete: (id: string) => void;
}

const MessageItem = ({ message, isSender, onDelete }: MessageItemProps) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div
      className={`flex w-full items-center ${
        isSender ? "justify-end" : "justify-start"
      } gap-2 relative`}
    >
      {isSender && (
        <div
          className="cursor-pointer -mt-2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowOptions(!showOptions)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 640 512"
            className="w-4 h-4"
          >
            <path d="M96 256a32 32 0 1 1 64 0 32 32 0 1 1-64 0zm192 0a32 32 0 1 1 64 0 32 32 0 1 1-64 0zm192 0a32 32 0 1 1 64 0 32 32 0 1 1-64 0z" />
          </svg>
        </div>
      )}
      <div className="flex flex-col max-w-[75%]">
        <div
          className={`px-4 py-2 rounded-2xl text-sm shadow-sm break-words ${
            isSender
              ? "bg-gradient-to-r from-[#9333EA] to-[#2563EB] text-white rounded-br-none"
              : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
          }`}
        >
          {message.content}
        </div>
        {message.created_at && (
          <div
            className={`text-[11px] mt-1 text-gray-500 ${
              isSender ? "text-right" : "text-left"
            }`}
          >
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>

      {showOptions && (
        <ul className={`absolute  mt-2  ${isSender?'bg-white right-14 ':'bg-purple-600 text-white left-14'} top-7  shadow-lg rounded-md z-10`}>
          <li>
            <button
              onClick={() => onDelete(message.id!)}
              className="w-full  px-2 py-2 text-left text-sm"
            >
              Delete
            </button>
          </li>
        </ul>
      )}

      {!isSender && (
        <div
          className="cursor-pointer -mt-2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowOptions(!showOptions)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 640 512"
            className="w-4 h-4"
          >
            <path d="M96 256a32 32 0 1 1 64 0 32 32 0 1 1-64 0zm192 0a32 32 0 1 1 64 0 32 32 0 1 1-64 0zm192 0a32 32 0 1 1 64 0 32 32 0 1 1-64 0z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
