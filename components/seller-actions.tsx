"use client";

import { updateProductState } from "@/app/products/[id]/action";
// import { ProductStatus } from "@prisma/client";

interface ISellerActionsProps {
  isSeller: boolean;
  productId: number | null; //nullable
  opponentId: number | null; //nullable
  status: "for_sale" | "reserved" | "sold" | null;
}

export default function SellerActions({
  isSeller,
  productId,
  opponentId,
  status,
}: ISellerActionsProps) {
  const handleSpecify = async () => {
    if (!productId || !opponentId) return; //null체크

    //구매자지정, 취소를 위해 newStatus생성
    const newStatus = status === "reserved" ? "for_sale" : "reserved";
    await updateProductState(productId, opponentId, newStatus);
  };
  return (
    <>
      {isSeller && (
        <button
          type="button"
          onClick={handleSpecify}
          className={`rounded-md border p-1 px-2 text-sm ${status === ProductStatus.reserved ? "border-orange-500 font-semibold text-white" : "border-neutral-500 text-neutral-500"} cursor-pointer`}
        >
          {status === ProductStatus.reserved ? (
            <span>지정 취소</span>
          ) : (
            <span>구매자 지정</span>
          )}
        </button>
      )}
    </>
  );
}
