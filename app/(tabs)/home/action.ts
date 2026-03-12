"use server";

import db from "@/lib/db";

/**
 * 상품 목록 페이지 전용 서버 액션
 * 역할: 사용자가 '더 보기' 버튼을 누르거나 스크롤을 내릴 때,
 * 기존에 본 상품들을 제외하고 다음 상품 데이터를 DB에서 가져옴.
 **/

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 1, // 지금까지 본 상품 개수만큼 건너뛰기(initialProduct(0) = 0개, 1페이지면 1개)
    take: 1, //새로 가져올 상품 개수
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
