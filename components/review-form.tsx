"use client";

import { useState } from "react";

interface IReviewProductProps {
  productId: number;
  sellerId: number;
  sellerName: string;
}

export default function ReviewForm({
  productId,
  sellerId,
  sellerName,
}: IReviewProductProps) {
  const [rating, setRating] = useState(0);
  return (
    <form>
      <div>
        <span>판매자 {sellerName}</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => setRating(star)}>
            {star <= rating ? "⭐" : "☆"}
          </button>
        ))}
      </div>
      <input type="text" placeholder="리뷰작성" />
      <button type="submit">완료</button>
    </form>
  );
}
