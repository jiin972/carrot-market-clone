import { formatToTimeAgo, formatToWon } from "@/lib/util"; //가격표기 변경 함수
import { ProductStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
  status: ProductStatus;
}

//목록 내 개별 상품 카드 컴포넌트
export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
  status,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="relative size-35 rounded-md overflow-hidden">
        <Image fill src={photo} className="object-cover" alt={title} />
        {status !== ProductStatus.for_sale &&
          (status === ProductStatus.reserved ? (
            <div className="absolute  bg-black/40 w-full h-full z-10 font-semibold text-neutral-200 text-2xl">
              <span className="flex h-full justify-center items-center">
                예약중
              </span>
            </div>
          ) : (
            <div className="absolute  bg-black/40 w-full h-full z-10 font-semibold text-neutral-200 text-2xl">
              <span className="flex h-full justify-center items-center">
                판매완료
              </span>
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-xl">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-xl font-semibold">{formatToWon(price)}</span>
      </div>
    </Link>
  );
}
