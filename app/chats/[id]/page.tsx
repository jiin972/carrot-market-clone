import ChatMessagesList from "@/components/chat-messages-list";
import getSession from "@/lib/session";
// import { Prisma } from "@prisma/client";
import { ProductStatusType } from "@/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getMessages, getRoom, getUserProfile } from "./action";
import SellerActions from "@/components/seller-actions";

//user(접속한)가 참여한 채팅방 메시지 목록을 렌더링
async function ChatRoomContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Promise타입인 params를 await로 풀고,
  // id를 구조분해 할당으로 추출
  const { id } = await params;
  const room = await getRoom(id); // getRoom에서만 권한체크(방 존재여부, 권한체크) + 상품정보 호출
  if (!room) return notFound();
  const initialMessages = await getMessages(id); //서버에서 db조회(최초 렌더링 용)
  const session = await getSession(); //UserId추출을 위한 session검증
  const user = await getUserProfile(); //Username/avatar를 추출하기 위한 함수 호출
  if (!user) return notFound();

  //상품의 구매자 확정 및 판매 상태 변경을 위한 로직
  const isSeller = room.product ? session.id === room.product.userId : false;
  const productId = room.product?.id ?? null;
  const opponent = room.users.find((user) => user.id !== session.id); //users배열에서 나 아닌 사람 찾기
  const opponentId = opponent?.id ?? null;
  const status = room.product?.status ?? null;
  return (
    <div>
      <ChatMessagesList
        userProfile={user}
        chatRoomId={id}
        userId={session.id!}
        initialMessages={initialMessages}
      />
      <div className="fixed top-0 right-0 p-4">
        <SellerActions
          isSeller={isSeller}
          productId={productId}
          opponentId={opponentId}
          status={status as any}
        />
      </div>
    </div>
  );
}

//initialMessgaes함수를 타입으로 전환,props로 클라이언트 컴포넌트에 전달
export type InicialChatMessages = Awaited<ReturnType<typeof getMessages>>;

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
