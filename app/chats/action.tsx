//클라이언트에서 호출 가능한 서버 함수로 등록
"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export async function deleteChatroom(chatRoomId: string) {
  const session = await getSession();
  if (!session.id) return;
  //연결된 메시지 먼저 삭제
  //chatRoom에 메시지가 들어있어서 chatRoom삭제불가
  await db.message.deleteMany({
    where: { chatRoomId: chatRoomId },
  });
  //메시지 삭제 후 채팅방 삭제
  await db.chatRoom.delete({
    where: {
      id: chatRoomId,
    },
  });
  redirect("/chats/");
}

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
      //상품별 채팅방 목록 렌더링을 위해, product정보 가져옴
      product: {
        select: {
          title: true,
          photo: true,
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
  //기존의 챗룸 존재여부 확인
  const existingRoom = await db.chatRoom.findFirst({
    where: {
      productId: productId,
      AND: [
        { users: { some: { id: product?.userId } } },
        { users: { some: { id: session.id } } },
      ],
    },
  });
  if (existingRoom) redirect(`/chats/${existingRoom.id}`); //기존의 chatRoom이 있을경우 redirect
  //기존의 챗룸 없을 경우 신규 챗룸 생성
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
      productId: productId, //구매자 지정을 위해 상품아이디 저장
    },
    select: {
      id: true, //생성된 ChatRoom의 Id만 반환
    },
  });
  redirect(`/chats/${room.id}`);
}
