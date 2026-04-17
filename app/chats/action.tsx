//클라이언트에서 호출 가능한 서버 함수로 등록
"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

//채팅 메시지 저장을 위한 서버액션 함수 정의
export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();
  const message = await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
}

//채팅방 생성을 위한 서버액션 함수 정의
export async function createChatRoom(formData: FormData) {
  //구매자 sesstion 검증
  const session = await getSession();
  //formData로 넘어온 prodcutId 추출
  const productId = Number(formData.get("productId"));
  //판매자 Id 확인을 위한 db조회
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  const room = await db.chatRoom.create({
    data: {
      users: {
        connect: [
          {
            id: product?.userId, //추출된 userId연결
          },
          { id: session.id },
        ],
      },
    },
    select: {
      id: true, //생성된 ChatRoom의 Id만 반환
    },
  });
  redirect(`/chats/${room.id}`);
}
