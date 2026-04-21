//클라이언트에서 호출 가능한 서버 함수로 등록
"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

//내(userId)가 참여한 채팅방을 목록 조회를 위한 함수 정의
// ChatRoom 목록을 조회(필터링), 이후 각 방에서 렌더링에 필요한 data추출
export async function getChatRooms() {
  const session = await getSession();
  const chatRooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: session.id!, //session.id로 참여한 방만 필터링
        },
      },
    },
    select: {
      id: true,
      created_at: true,
      updated_at: true,
      users: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      messages: {
        select: {
          payload: true,
          created_at: true,
        },
        orderBy: {
          created_at: "desc",
        },
        take: 1, //마지막 메시지 1개만 take
      },
    },
  });
  return chatRooms; //chatRoom배열을 반환
}

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
  return message;
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
