"use client";

import deleteProduct from "@/app/products/[id]/action";

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
      className="bg-red-500 p-5 rounded-md text-white font-semibold"
    >
      Delete Product
    </button>
  );
}
