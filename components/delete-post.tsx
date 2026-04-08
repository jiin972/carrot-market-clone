"use client";

import { deletePost } from "@/app/post/[id]/action";

interface DeletePostProps {
  postId: number;
}

export default function DeletePost({ postId }: DeletePostProps) {
  const handleDelete = async () => {
    const ok = window.confirm("글을 삭제합니까?");
    if (ok) {
      await deletePost(postId);
    }
  };
  return (
    <div>
      <button
        onClick={handleDelete}
        className="text-sm text-orange-500 cursor-pointer hover:text-orange-300"
      >
        Delete
      </button>
    </div>
  );
}
