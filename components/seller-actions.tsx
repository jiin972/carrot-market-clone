"use client";

import { updateProductState } from "@/app/products/[id]/action";
import { ProductStatus } from "@prisma/client";

interface ISellerActionsProps {
  isSeller: boolean;
  productId: number | null; //nullable
  opponentId: number | null; //nullable
  status: ProductStatus | null;
}

export default function SellerActions({
  isSeller,
  productId,
  opponentId,
  status,
}: ISellerActionsProps) {
  const handleSpecify = async () => {
    if (!productId || !opponentId) return; //null체크
    await updateProductState(productId, opponentId, ProductStatus.reserved);
  };
  console.log("셀러:", isSeller);
  return (
    <>
      {isSeller && (
        <button
          type="button"
          onClick={handleSpecify}
          className={`p-1 px-2 text-sm sm:text-base border-none rounded-md ${status === ProductStatus.reserved ? "bg-orange-500" : "bg-neutral-500"} cursor-pointer`}
        >
          구매자지정
        </button>
      )}
    </>
  );
}
