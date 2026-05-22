"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import z from "zod";

export async function getReviewProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  if (!product) notFound();
  return product;
}

export async function createReview(formData: FormData) {
  const session = await getSession();
  if (!session.id) return; //로그인 안됐으면 종료
  const data = {
    productId: formData.get("productId"),
    sellerId: formData.get("sellerId"),
    payload: formData.get("payload"),
    rating: formData.get("rating"),
  };
  const reviewSchema = z.object({
    payload: z.string().min(10, "10자 이상 작성해야 합니다."),
    rating: z.coerce.number().min(1).max(5), // string->number변환
    productId: z.coerce.number(), // string->number변환
    sellerId: z.coerce.number(), // string->number변환
  });
  const result = reviewSchema.safeParse(data);
  if (!result.success) return; // 실패시 종료
  // if (!result.success) {
  //   const flatten = z.flattenError(result.error);
  //   return {
  //     fieldError: flatten.fieldErrors,
  //     payload: data,
  //   };
  // }
  const review = await db.review.create({
    data: {
      payload: result.data.payload,
      rating: result.data.rating,
      productId: result.data.productId,
      createdById: session.id,
      createdForId: result.data.sellerId,
    },
  });
}
