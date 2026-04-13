"use client";

import { InicialChatMessages } from "@/app/(tabs)/chats/[id]/page";
import Image from "next/image";
import { useState } from "react";
import TimeAgo from "./time-ago";

interface ChatMessagesListProps {
  initialMessages: InicialChatMessages;
  userId: number;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  return (
    <div className="px-5 py-20 flex flex-col gap-5 min-h-screen justify-end">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${message.userId === userId ? "flex-row-reverse" : ""}`}
        >
          {message.user.avatar ? (
            <Image
              src={message.user.avatar!}
              width={24}
              height={24}
              alt={message.user.username}
              className="size-7 rounded-full"
            />
          ) : (
            <div>
              <span className="flex items-center justify-center size-7 rounded-full bg-neutral-400">
                {message.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div
            className={`flex flex-col gap-1 ${message.userId === userId ? "items-end" : "items-start"}`}
          >
            <span
              className={`${message.userId === userId ? "bg-neutral-500" : "bg-amber-500"} p-2.5 rounded-md `}
            >
              {message.payload}
            </span>
            <TimeAgo time={message.created_at.toString()} />
          </div>
        </div>
      ))}
    </div>
  );
}
