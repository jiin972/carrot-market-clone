import { notFound } from "next/navigation";
import { getPost } from "./action";
import EditPostForm from "@/components/edit-post-form";
import { Suspense } from "react";

// getPost(데이터조회)를 suspense안으로 이동
// Next.js16의 캐시컴포넌트 모드에서는 모든 동적 데이터는 Suspense안에 있어야 함
async function PostEditor({ postId }: { postId: number }) {
  const post = await getPost(postId);
  if (!post) return notFound();
  return <EditPostForm post={post} />;
}

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  if (isNaN(postId)) return notFound();
  return (
    <Suspense fallback={null}>
      <PostEditor postId={postId} />
    </Suspense>
  );
}
export async function generateStaticParams() {
  return [{ id: 1 + "" }];
}
