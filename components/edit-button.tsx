"use client";

import { updateProduct } from "@/app/products/[id]/edit/action";
import Button from "./button";
import Input from "./input";
import React from "react";

export default function EditButton({
  productId,
  product,
}: {
  productId: number;
  product: {
    title: string;
    price: number;
    description: string;
  };
}) {
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    const ok = window.confirm("해당상품을 수정하시겠습니까?");
    if (!ok) return e.preventDefault();
  };
  return (
    <div className="mt-10 p-5">
      <form
        onSubmit={handleSubmit}
        action={updateProduct.bind(null, productId)}
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <span className="text-lg font-semibold">상품명</span>
          <Input
            name="title"
            placeholder="제목"
            type="text"
            defaultValue={product.title}
          />
        </div>
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <span className="text-lg font-semibold">상품설명</span>
          <Input
            name="price"
            placeholder="가격"
            type="number"
            defaultValue={product.price}
          />
        </div>
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <span className="text-lg font-semibold">상품가격</span>
          <Input
            name="description"
            placeholder="자세한 설명"
            type="text"
            defaultValue={product.description}
          />
        </div>
        <div className="mt-10">
          <Button text="수정완료" />
        </div>
      </form>
    </div>
  );
}
