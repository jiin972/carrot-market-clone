"use client";

import { deleteChatroom } from "@/app/chats/action";

export default function DeleteChatRoom({ chatRoomId }: { chatRoomId: string }) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = window.confirm("해당 대화를 삭제합니까?");
    if (ok) {
      await deleteChatroom(chatRoomId);
    }
  };
  return (
    <button
      className="text-sm sm:text-base cursor-pointer "
      onClick={handleDelete}
    >
      삭제
    </button>
  );
}
