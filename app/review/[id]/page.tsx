import ReviewForm from "@/components/review-form";
import Image from "next/image";
import { createReview, getReviewProduct } from "./action";
import { Suspense } from "react";

async function ReviewContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  const reviewProduct = await getReviewProduct(productId);

  return (
    <div className="flex flex-col w-full p-5 items-center">
      <div className="flex flex-col  gap-5">
        <Image
          src={reviewProduct?.photo}
          alt={reviewProduct?.title}
          width={100}
          height={100}
          className="size-32 rounded-md"
        />
        <div className="text-lg font-semibold">{reviewProduct.title}</div>
      </div>
      <ReviewForm
        action={createReview}
        productId={productId}
        sellerId={reviewProduct.userId}
        sellerName={reviewProduct.user.username}
      />
    </div>
  );
}
export default async function Review({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={"Now loading.."}>
      <ReviewContent params={params} />
    </Suspense>
  );
}
