"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { ProductStatus } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

//제품 판매상태 변경로직(디테일 페이지 내)
export async function updateProductState(
  productId: number,
  buyerId: number | null,
  status: ProductStatus,
) {
  const session = await getSession();
  if (!session.id) return;
  await db.product.update({
    where: { id: productId },
    data: {
      status: status,
      buyerId: buyerId,
    },
  });
  if (status === ProductStatus.sold) {
    await db.purchase.create({
      data: {
        productId: productId,
        userId: session.id, //구매자Id
      },
    });
  }
  revalidateTag("update", { expire: 0 });
  revalidateTag("product-list", { expire: 0 });
}

//제품 삭제 로직(디테일 페이지 내)
export async function deleteProduct(productId: number) {
  const session = await getSession();

  // 진짜 주인 DB에서 확인(보안핵심)
  const product = await db.product.findUnique({
    where: { id: productId }, //id로 행(row)찾기
    select: { userId: true }, //찾은 행에서 userId 열(column)만 추출, DB부하 줄이기
  });

  // session.id와 user.id 비교, 틀리면 종료
  // 서버액션은 조작이 불가능하므로 이곳에서 체크하는 것이 진짜 보안임
  if (!product || product.userId !== session.id) {
    throw new Error("삭제 권한이 없습니다.");
  }
  await db.product.delete({ where: { id: productId } });
  revalidatePath("/home");
  redirect("/home");
}
