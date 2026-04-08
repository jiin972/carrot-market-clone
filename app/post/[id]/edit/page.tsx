import { notFound } from "next/navigation";
import { getPost } from "./action";
import EditPostForm from "@/components/edit-post-form";
import { Suspense } from "react";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //URL Params에서 Id추출
  const { id } = await params;
  const postId = Number(id);
  if (isNaN(postId)) return notFound();
  const post = await getPost(postId); //getPost는 객체반환
  if (!post) return notFound();
  return (
    <Suspense>
      <EditPostForm post={post} />
    </Suspense>
  );
}
