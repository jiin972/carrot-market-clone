import CloseButton from "@/components/close-button";
import db from "@/lib/db";
import { formatToTimeAgo, formatToWon } from "@/lib/util";
import { PhotoIcon, UserIcon } from "@heroicons/react/16/solid";
// import { ProductStatus } from "@prisma/client";
import { ProductStatusType } from "@/types";
import { cacheTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

//DB data 호출함수
async function getProduct(productId: number) {
  "use cache";
  cacheTag("update");
  // await new Promise((resolve) => setTimeout(resolve, 1000)); //로딩지연코드, skeletonTest
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    //userAvatar도 include함
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export default async function Modal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //params에서 id추출 및 number변환(db의 id는 number)
  const { id } = await params; //const id = (await params).id
  const productId = Number(id);
  /**
   * [방어코드]
   * user가 주소창에 /product/abc 처럼 숫자가 아닌 값을 직접 입력하건,
   * 브라우저의 히스토리 조작 과정에서 예상치 못한 값이 들어올 경우를 대비함
   * 숫자가 아닌 경우(NaN) DB 조회를 시도하지 않고 바로 차단하여 서버 부하를 줄임
   */
  if (Number.isNaN(productId)) {
    return notFound(); // 또는 404페이지 노출
  }
  //DB에서 prodcut 를 읽음
  const product = await getProduct(productId);
  if (!product) return;
  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-gray-700/10 backdrop-blur-sm">
      <CloseButton />
      <div className="h-125` relative w-full max-w-3xl">
        <div className="flex h-full w-full overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 shadow-2xl">
          {/*사진영역*/}
          <div className="relative flex-1 bg-neutral-800">
            {product.photo !== null ? (
              <Image
                src={product.photo}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <PhotoIcon className="h-28 text-neutral-600" />
            )}
            {product.status !== "for_sale" && (
              <div className="absolute h-full w-full bg-black/40 text-2xl font-semibold text-neutral-200">
                <span className="flex h-full items-center justify-center">
                  {product.status === "reserved" ? "예약중" : "판매완료"}
                </span>
              </div>
            )}
          </div>
          {/*정보영역*/}
          <div className="flex flex-1 flex-col justify-between gap-4 p-6">
            <div className="flex flex-col gap-5">
              <h2 className="text-2xl font-semibold">
                제품명: {product.title}
              </h2>
              <div className="flex items-center gap-5">
                {product.user.avatar !== null ? (
                  <Image
                    src={product.user.avatar}
                    alt={product.user.username}
                    width={40}
                    height={40}
                    className="size-10 rounded-full"
                  />
                ) : (
                  <UserIcon className="size-10" />
                )}

                <div>작성자: {product.user.username}</div>
              </div>
              <p className="w-full border-t pt-5 text-neutral-200">
                설 명: {product.description}
              </p>
            </div>
            <div>
              <div>판매금액: {formatToWon(product.price)}</div>
              <span className="mt-auto text-sm text-neutral-500">
                등록일: {formatToTimeAgo(product.created_at.toString())}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
