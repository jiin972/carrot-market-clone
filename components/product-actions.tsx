"use client";

import { updateProductState } from "@/app/products/[id]/action";
// import { ProductStatus } from "@prisma/client";

interface IProductActionsProps {
  productId: number;
  isBuyer: boolean;
  status: "for_sale" | "reserved" | "sold" | null;
  // status: ProductStatus; // Prisma enum타입(for_sale/reserved/sold만 허용)
  buyerId: number | null; //nullable
}

export default function ProductActions({
  productId,
  isBuyer,
  status,
  buyerId,
}: IProductActionsProps) {
  const handleConfirm = async () => {
    await updateProductState(productId, buyerId, "sold");
  };
  return (
    <div className="text-sm sm:text-base md:text-lg">
      {isBuyer && status === "reserved" ? (
        <button
          onClick={handleConfirm}
          className="rounded-md bg-orange-500 p-1 px-2 text-sm font-semibold text-white"
        >
          구매완료
        </button>
      ) : null}
    </div>
  );
}
