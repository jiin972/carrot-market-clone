import ReviewForm from "@/components/review-form";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { createReview, getReviewProduct } from "./action";

async function ReviewContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  const session = await getSession();
  const reviewProduct = await getReviewProduct(productId);
  const existingReview = await db.review.findUnique({
    where: {
      productId_createdById: { productId: productId, createdById: session.id! },
    },
  });
  return (
    <div className="flex flex-col w-full p-5 items-center relative">
      <div className="absolute top-4 left-4 bg-neutral-600/50 p-2 rounded-full font-semibold z-50">
        <Link href={"/profile"}>
          <ChevronLeftIcon className="size-6 text-white " />
        </Link>
      </div>
      <div className="flex flex-col gap-5 py-5">
        <Image
          src={reviewProduct?.photo}
          alt={reviewProduct?.title}
          width={100}
          height={100}
          className="size-32 rounded-md"
        />
        <div className="text-lg font-semibold">{reviewProduct.title}</div>
      </div>
      {existingReview ? (
        <div className="flex flex-col items-center py-5 gap-3">
          {/*.repeate을 이용해 number만큼 star표시 */}
          <div>{"⭐️".repeat(existingReview.rating)}</div>{" "}
          <div>{existingReview.payload}</div>
        </div>
      ) : (
        <ReviewForm
          action={createReview}
          productId={productId}
          sellerId={reviewProduct.userId}
          sellerName={reviewProduct.user.username}
        />
      )}
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
