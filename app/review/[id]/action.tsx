import db from "@/lib/db";
import { notFound } from "next/navigation";

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
