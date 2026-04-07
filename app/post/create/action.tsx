"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

//zod를 사용한 validation schema정의
const createPostSchema = z.object({
  title: z
    .string({ error: "포스트 제목은 필수입니다." })
    .min(1, "포스트 제목은 필수입니다."),
  description: z
    .string({ error: "포스트 내용은 필수입니다." })
    .min(1, "포스트 내용은 필수입니다."),
});

//Post DB모델 생성을 위한 서버액션 코드 구현
export async function createPost(prevState: any, formData: FormData) {
  //세션(userId)검증
  const session = await getSession();
  //FormData호출
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  //zod Schema검증
  const result = createPostSchema.safeParse({ title, description });
  //서버액션 결과를 클라이언트에 전달
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return {
      fieldErrors: flatten.fieldErrors,
      payload: { title, description },
    };
  }

  await db.post.create({
    data: {
      userId: session.id!,
      title: result.data.title,
      description: result.data.description,
    },
  });
  revalidateTag(`posts`, { expire: 0 }); //Post목록만 갱신
  redirect("/life");
}
