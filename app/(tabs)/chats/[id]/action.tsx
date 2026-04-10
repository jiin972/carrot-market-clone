import db from "@/lib/db";
import getSession from "@/lib/session";

export async function getRoom(roomId: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id: roomId,
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
