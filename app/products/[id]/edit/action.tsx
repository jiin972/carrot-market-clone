"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
import z from "zod";

//formData의 규칙검사
const productSchema = z.object({
  title: z
    .string({ error: "제목은 필수입니다." })
    .min(1, "제목을 입력해 주세요."),
  price: z.coerce //coerce로 number형태로 변환
    .number({ error: "금액은 필수입니다." })
    .min(1, "금액을 입력해 주세요."),
  description: z.string(),
});

export async function updateProduct(productId: number, formData: FormData) {
  //권한체크 - 세션확인, 로그인 여부체크(API차단)
  const session = await getSession();
  if (!session) return notFound();

  //권한체크 - 상품 소유자 확인
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product || product.userId !== session.id) return notFound();

  //formData추출 - form에서 submit한 data를 꺼냄
  const data = {
    //     photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  //data검증 및 DB 업데이트
  const result = productSchema.safeParse(data);
  if (!result.success) return;
  else {
    await db.product.update({
      where: {
        id: productId, // 어떤 상품을 수정할지
      },
      data: {
        title: result.data.title,
        price: result.data.price,
        description: result.data.description,
      },
    });
  }
  //캐시 갱신 및 redirect
  revalidateTag("update", "max");
  redirect(`/products/${product.id}`);
}
