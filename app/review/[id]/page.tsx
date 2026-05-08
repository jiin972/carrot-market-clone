import Image from "next/image";
import { getReviewProduct } from "./action";
import ReviewForm from "@/components/review-form";

export default async function Review({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  const reviewProduct = await getReviewProduct(productId);

  return (
    <div>
      <div>
        <Image
          src={reviewProduct?.photo}
          alt={reviewProduct?.title}
          width={100}
          height={100}
        />
        <div>{reviewProduct?.title}</div>
      </div>
      <ReviewForm
        productId={productId}
        sellerId={reviewProduct.userId}
        sellerName={reviewProduct.user.username}
      />
    </div>
  );
}
