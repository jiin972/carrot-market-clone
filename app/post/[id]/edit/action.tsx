"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import z from "zod";

export async function getPost(id: number) {
  //해당 함수 동적환경에서 실행됨을 명시함
  await connection(); //빌드타임이 아닌 런타임에 실행되도록 함
  const post = await db.post.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      userId: true,
    },
  });
  // if (!post) return notFound(); use server안에서 notFound()사용불
  return post;
}

const updatePostSchema = z.object({
  title: z
    .string({ error: "포스트 제목은 필수입니다." })
    .min(1, "포스트 제목은 필수입니다."),
  description: z
    .string({ error: "포스트 내용은 필수입니다." })
    .min(1, "포스트 내용은 필수입니다."),
});

export async function updatePost(prevstate: any, formData: FormData) {
  //권한 체크 - 세션 확인 및 로그인여부 확인
  const session = await getSession();
  if (!session) return notFound();
  //formData호출
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  //FormData에서 postId추출
  const postId = Number(formData.get("postId"));
  //zod schema검증
  const result = updatePostSchema.safeParse({ title, description });
  //서버액션의 결과를 클라이언트에 전달
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return {
      fieldError: flatten.fieldErrors,
      payload: { title, description },
    };
  }

  //db업데이트
  await db.post.update({
    where: {
      id: postId,
    },
    data: {
      title: result.data.title,
      description: result.data.description,
    },
  });
  revalidateTag(`post-${postId}`, { expire: 0 }); // 개별 post 캐시
  revalidateTag("posts", { expire: 0 });
  redirect(`/post/${postId}`);
}
