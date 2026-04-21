import getSession from "@/lib/session";
import { Suspense } from "react";
import { getChatRooms } from "./action";
import Image from "next/image";
import TimeAgo from "@/components/time-ago";
import Link from "next/link";

//user(접속한)가 참여한 채팅방 목록 랜더링 구현
export async function Chats() {
  const session = await getSession(); //상대방 필터링용
  const chatRooms = await getChatRooms(); //목록 data
  return (
    <div>
      <h1 className="p-5 text-white text-4xl">채팅</h1>
      {chatRooms.map((room) => (
        <Link
          key={room.id}
          href={`chats/${room.id}`}
          className="block transition-all duration-200 hover:scale-105 hover:text-orange-500 active:scale-95"
        >
          {room.users
            .filter((user) => user.id !== session.id)
            .map((user) => (
              <div
                key={user.id}
                className="flex shrink-0 items-center gap-3 p-5"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="size-10 flex shrink-0 items-center justify-center bg-neutral-500 rounded-full">
                    <span className="text-white font-semibold text-2xl">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="w-full">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-white">{user.username}</div>
                    <TimeAgo time={room.created_at.toString()} />
                  </div>
                  <div className="text-white font-semibold">
                    {room.messages[0]?.payload}
                  </div>
                </div>
              </div>
            ))}
        </Link>
      ))}
    </div>
  );
}

//Suspense로 감싸기
export default async function ChatRoomList() {
  return (
    <Suspense fallback={"Now Loading.."}>
      <Chats />
    </Suspense>
  );
}
