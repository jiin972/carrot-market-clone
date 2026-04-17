"use client";

import { InicialChatMessages } from "@/app/chats/[id]/page";
import { ArrowUpIcon, ChevronLeftIcon } from "@heroicons/react/16/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TimeAgo from "./time-ago";
import { saveMessage } from "@/app/chats/action";

interface ChatMessagesListProps {
  initialMessages: InicialChatMessages;
  userId: number;
  chatRoomId: string;
  userProfile: {
    username: string;
    avatar: string | null;
  };
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  userProfile,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  //입력창에 현재 타이핑 중인 텍스트 저장, 초기값("")
  const [message, setMessage] = useState("");
  //컴포넌트 내 함수 간 채널 객체 공유(리렌더링 없이 유지)
  const channel = useRef<RealtimeChannel | null>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    //원본불변원칙에 따라 업데이트진행, prevMsgs와 newMessages의 타입일치
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId: userId,
        user: {
          username: "string",
          avatar: "xxx",
        },
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      //prevMsgs 타입과 일치시키기 위해 palyload에 필요한 데이터 담기
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: userProfile.username,
          avatar: userProfile?.avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };
  //supabase클라이언트 실행(Realtime채널 구독)
  useEffect(() => {
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
    //chatRoomId(props)로 고유 채널 생성 후 useRef.current에 저장
    //-> useEffect/onSubmit 함수 간 리렌더링 없이 공유
    channel.current = supabaseClient.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        console.log("패이로드", payload.payload);
        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
      })
      .subscribe((status) => {
        console.log("구독상태", status);
      });
    //클린업 함수 적용
    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);
  return (
    <div className="relative p-5 flex flex-col gap-5 min-h-screen justify-end">
      <div className="absolute top-4 left-4 bg-black/50 p-2 rounded-full font-semibold">
        <Link href={"/home"}>
          <ChevronLeftIcon className="size-6 text-white " />
        </Link>
      </div>
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
      <form onSubmit={onSubmit} className="flex relative">
        <input
          type="text"
          required
          onChange={onChange}
          value={message}
          className="w-full h-12  rounded-full bg-transparent focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-700"
          placeholder={"Write a message"}
        />
        <button type="submit" className="absolute  top-1 right-2">
          <ArrowUpIcon className="size-10 text-white transition-colors hover:text-orange-300 bg-orange-500 rounded-full " />
        </button>
      </form>
    </div>
  );
}
