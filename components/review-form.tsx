"use client";

import { useState } from "react";

interface IReviewProductProps {
  productId: number;
  sellerId: number;
  sellerName: string;
  action: (fromData: FormData) => Promise<void>; // serverAction함수를 props로 받음
}

export default function ReviewForm({
  productId,
  sellerId,
  sellerName,
  action,
}: IReviewProductProps) {
  const [rating, setRating] = useState(0);
  return (
    <form action={action} className="p-5 flex flex-col gap-3 w-full ">
      <div className="w-full flex gap-3 text-lg">
        <span className="font-semibold">판매자: {sellerName}</span>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)}>
              {star <= rating ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </div>
      <input type="hidden" name="rating" value={rating} />
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="sellerId" value={sellerId} />
      <div className="flex flex-col gap-3 w-full h-70">
        <textarea
          name="payload"
          placeholder="거래 경험을 공유해 주세요"
          className="bg-transparent border rounded-md flex-1 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className="border-none flex justify-center px-5 py-1 rounded-md bg-orange-500 text-white font-semibold"
          >
            완료
          </button>
        </div>
      </div>
    </form>
  );
}
