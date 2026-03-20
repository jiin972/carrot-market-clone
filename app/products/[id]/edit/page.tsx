import EditButton from "@/components/edit-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

//수정권한 체크(ui용)
async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

//DB에서 상품 정보 호출
async function getProduct(productId: number) {
  const product = await db.product.findUnique({
    where: { id: productId }, //userId기본 포함
  });
  return product;
}

//상품정보 수정함수
export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  //id Number여부 및 상품아이디 확인(안전장치)
  if (isNaN(productId)) {
    return notFound();
  }
  const product = await getProduct(productId);
  if (!product) {
    return notFound();
  }

  //상품등록자와 수정자 동일 확인
  const isOwner = await getIsOwner(product.userId);
  if (!isOwner) return notFound();
  return (
    <div>
      <EditButton productId={productId} product={product} />
    </div>
  );
}
