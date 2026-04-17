import db from "@/lib/db";
import getSession from "@/lib/session";

//user정보를 db로부터 가져오는 함수 생성
//가져온 정보를 newMessages의 payload에 전달
export async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      avatar: true,
      username: true,
    },
  });
  return user;
}

//해당 채팅방의 메시지 목록 조회(메시지 목록)
export async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}

//특정 채팅방 하나 조회(권한 체크용),권한이 없을 경우 notFound()
export async function getRoom(chatRoomId: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id: chatRoomId,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    //users배열에서 session.id와 일치하는 유저찾기
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    if (!canSee) return null;
  }
  return room;
}
