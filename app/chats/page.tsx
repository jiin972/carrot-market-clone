import getSession from "@/lib/session";
import { Suspense } from "react";
import { getChatRooms } from "./action";
import Image from "next/image";
import TimeAgo from "@/components/time-ago";
import Link from "next/link";
import DeleteChatRoom from "@/components/delete-chatroom";

//user(접속한)가 참여한 채팅방 목록 랜더링 구현
async function Chats() {
  const session = await getSession(); //상대방 필터링용
  const chatRooms = await getChatRooms(); //목록 data
  return (
    <div>
      <h1 className="p-5 text-white text-4xl">채팅</h1>
      {chatRooms.map((room) => (
        <div key={room.id} className="flex justify-between items-center px-5">
          <Link
            href={`chats/${room.id}`}
            className="block transition-all duration-200 active:scale-95"
          >
            {room.users
              .filter((user) => user.id !== session.id)
              .map((user) => (
                <div
                  key={user.id}
                  className="relative flex shrink-0 items-center gap-6 p-5"
                >
                  {room.product?.photo ? (
                    <Image
                      src={room.product.photo}
                      alt={room.product.title}
                      width={80}
                      height={80}
                      className="size-15 rounded-md aspect-square"
                    />
                  ) : (
                    <div className="size-15 rounded-md aspect-square">
                      <span className="text-white font-semibold text-2xl">
                        {room.product?.title}
                      </span>
                    </div>
                  )}
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      width={40}
                      height={40}
                      className=" absolute bottom-4 left-13 border border-neutral-100 size-8 flex shrink-0 items-center justify-center bg-neutral-500 rounded-full"
                    />
                  ) : (
                    <div className="absolute bottom-4 left-13 border border-neutral-100 size-8 flex shrink-0 items-center justify-center bg-neutral-500 rounded-full">
                      <span className="text-white font-semibold text-2xl">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="w-full">
                    <div className="w-full flex items-center justify-between gap-5">
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
          <div className="text-orange-500 active:text-neutral-400 pr-5">
            <DeleteChatRoom chatRoomId={room.id} />
          </div>
        </div>
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
