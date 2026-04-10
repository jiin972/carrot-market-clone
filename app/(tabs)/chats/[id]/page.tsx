import { notFound } from "next/navigation";
import { getRoom } from "./action";
import { Suspense } from "react";

async function ChatRoomContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await getRoom(id);
  if (!room) return notFound();
  return <h1>Chat!</h1>;
}

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
