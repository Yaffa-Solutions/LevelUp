import { Message } from "@/app/types/chat";

export default function ChatMessage({ content, sender_id }: Message) {
  const isAI = !sender_id;
  const formatAIMessage = (text: string) => {
    const lines = text.split("\n");

    return lines.map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <h3 key={index} className="font-bold text-lg mt-3 mb-1">
            {line.replace(/\*\*/g, "")}
          </h3>
        );
      } else if (line.startsWith("* ")) {
        return (
          <li key={index} className="ml-5 list-disc">
            {line.replace("* ", "")}
          </li>
        );
      } else {
        return (
          <p key={index} className="my-1">
            {line}
          </p>
        );
      }
    });
  };

  return (
    <div className={`flex ${isAI ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`max-w-[70%] p-3 rounded-2xl  text-sm shadow-md ${
          isAI
            ? "bg-gradient-to-r from-[#9333EA] to-[#2563EB]  text-white"
            : "bg-white text-gray-900 border-gray-200"
        }`}
      >
        {formatAIMessage(content!)}
      </div>
    </div>
  );
}
