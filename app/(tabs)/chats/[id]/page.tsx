import ChatMessagesList from "@/components/chat-messages-list";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getMessages, getRoom } from "./action";
import getSession from "@/lib/session";

//user(접속한)가 참여한 채팅방 메시지 목록을 렌더링
async function ChatRoomContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Promise타입인 params를 await로 풀고,
  // id를 구조분해 할당으로 추출
  const { id } = await params;
  const room = await getRoom(id); // getRoom에서만 권한체크(방 존재여부, 권한체크)
  if (!room) return notFound();
  const initialMessages = await getMessages(id); //서버에서 db조회(최초 렌더링 용)
  const session = await getSession(); //UserId추출을 위한 session검증
  return (
    <div>
      <ChatMessagesList userId={session.id} initialMessages={initialMessages} />
    </div>
  );
}

//initialMessgaes함수를 타입으로 전환,props로 클라이언트 컴포넌트에 전달
export type InicialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

//Suspens로 감싸 비동기 데이터 로딩 처리 및 ChatRoomContent에 params전달
export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={"Now loading.."}>
      <ChatRoomContent params={params} />
    </Suspense>
  );
}
