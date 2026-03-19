"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const productSchema = z.object({
  photo: z
    .string({
      error: "사진은 필수입니다.",
    })
    .min(1, "사진은 필수입니다."),
  title: z
    .string({
      error: "제목은 필수입니다.",
    })
    .min(1, "제목은 필수입니다."),
  description: z.string(),
  price: z.coerce
    .number({
      error: "금액은 필수입니다.",
    })
    .min(1, "금액을 입력해 주세요"),
});

//user의 input값을 get해 formData에 담아 서버로 전달
export async function uploadProduct(prevState: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  if (data.photo instanceof File && data.photo.size > 0) {
    const photoData = await data.photo.arrayBuffer(); //파일 내용 확인
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData)); //지정경로로 파일생성
    data.photo = `/${data.photo.name}`;
  } else {
    data.photo = "";
  }

  const result = productSchema.safeParse(data);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return {
      fieldErrors: flatten.fieldErrors,
      payload: data,
    };
  } else {
    //prisma.schema와 동일한 data형태로 구현
    const session = await getSession(); //현재 로그인한 유저 세션가져오기
    if (session.id) {
      //DB에 새로운 행(row)추가
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          //상품을 등록한 user와 연결(product.userId = session.id)
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      revalidatePath("/home"); //상품 등록 후, "/home"의 목록 캐시 무효화
      redirect(`/products/${product.id}`);
    }
  }
}
