"use client";

import { deleteProduct } from "@/app/products/[id]/action";

export default function DeleteButton({ productId }: { productId: number }) {
  const handleDelete = async () => {
    const ok = window.confirm("해당 상품을 삭제합니까?");
    if (ok) {
      await deleteProduct(productId);
    }
  };
  return (
    <button
      onClick={handleDelete}
      className="flex items-center bg-red-500 p-1 px-2 rounded-md text-white font-semibold text-sm sm:text-base md:text-lg"
    >
      Delete Product
    </button>
  );
}
