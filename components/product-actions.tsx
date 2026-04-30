"use client";

import { updateProductState } from "@/app/products/[id]/action";
import { ProductStatus } from "@prisma/client";

interface IProductActionsProps {
  productId: number;
  isOwner: boolean;
  isBuyer: boolean;
  status: ProductStatus; // Prisma enum타입(for_sale/reserved/sold만 허용)
  buyerId: number | null; //nullable
}

export default function ProductActions({
  productId,
  isOwner,
  isBuyer,
  status,
  buyerId,
}: IProductActionsProps) {
  const handleReserve = async () => {
    await updateProductState(productId, buyerId, ProductStatus.reserved);
  };
  const handleCancelReserve = async () => {
    await updateProductState(productId, null, ProductStatus.for_sale);
  };
  const handleConfirm = async () => {
    await updateProductState(productId, buyerId, ProductStatus.sold);
  };
  return (
    <div className="text-sm sm:text-base md:text-lg">
      {isOwner && status === ProductStatus.for_sale ? (
        <button
          onClick={handleReserve}
          className="p-1 px-2 rounded-md bg-orange-500 text-white text-sm font-semibold cursor-pointer"
        >
          예약하기
        </button>
      ) : null}
      {isOwner && status === ProductStatus.reserved ? (
        <button
          onClick={handleCancelReserve}
          className="p-1 px-2 rounded-md bg-orange-500 text-white text-sm font-semibold cursor-pointer"
        >
          예약취소
        </button>
      ) : null}
      {isBuyer && status === ProductStatus.reserved ? (
        <button className="p-1 px-2 rounded-md bg-orange-500 text-white text-sm font-semibold">
          구매완료
        </button>
      ) : null}
    </div>
  );
}
