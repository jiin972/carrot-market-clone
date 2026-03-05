"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export default async function deleteProduct(productId: number) {
  const session = await getSession();

  // 진짜 주인 DB에서 확인(보안핵심)
  const product = await db.product.findUnique({
    where: { id: productId }, //id로 행(row)찾기
    select: { userId: true }, //찾은 행에서 userId 열(column)만 추출, DB부하 줄이기
  });

  // session.id와 user.id 비교, 틀리면 종료
  if (!product || product.userId !== session.id) {
    throw new Error("삭제 권한이 없습니다.");
  }

  await db.product.delete({ where: { id: productId } });

  return redirect("/");
}
