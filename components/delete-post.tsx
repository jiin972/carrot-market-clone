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
        className="bg-red-500 px-1 rounded-md text-white text-sm font-semibold"
      >
        Delete
      </button>
    </div>
  );
}
