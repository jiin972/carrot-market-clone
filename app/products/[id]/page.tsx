import { createChatRoom } from "@/app/chats/action";
import DeleteButton from "@/components/delete-button";
import ProductActions from "@/components/product-actions";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/util";
import { UserIcon } from "@heroicons/react/16/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
// import { ProductStatus } from "@prisma/client";
import { ProductStatusType } from "@/types";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

//동적 metadata생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);
  const product = await getProductTitle(productId); //dataBase에 id를 통한 상품조회 query(요청)
  return {
    title: `🥕 ${product?.title}`,
  };
}
//4. 권한체크(UI용) - 판매완료 여부 표시 결정용
//buyerId가 있을 경우, session.id와 일치 여부를 확인하는 권한(autorization)체크
async function getIsBuyer(buyerId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === buyerId;
  }
  return false;
}

//3. 권한체크(UI용) - 삭제버튼 표시 결정용
//접속자와 등록자가 일치여부를 확인하는 권한(autorization)체크
async function getIsOwner(userId: number) {
  const session = await getSession(); // 쿠키 읽기
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

//2. DB에서 상품 정보 호출
//비동기함수로 Db에서 productId로 product를 조회
//status, buyerId 등 스칼라 필드 자동포함
async function getProduct(productId: number) {
  "use cache"; //nextCache사용
  cacheTag("update"); //cacheTag 지정
  console.log("products");
  const product = await db.product.findUnique({
    where: {
      id: productId, // Id로 행(row) 찾기
    },
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

async function getProductTitle(productId: number) {
  "use cache";
  cacheTag("update");
  console.log("title");
  const product = await db.product.findUnique({
    where: {
      id: productId, // Id로 행(row) 찾기
    },
    select: {
      title: true,
    },
  });
  return product;
}

//1. params의 data호출
//비동기 함수로 params에서 id를 꺼냄(params는 Promise임)
export default async function ProductsDeatail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; //params에서 id추출
  const productId = Number(id); //추출된 id를 number로 변경

  //Id의 Number여부 판단
  if (isNaN(productId)) {
    return notFound();
  }
  const product = await getProduct(productId);
  if (!product) {
    return notFound();
  }
  //getIsOwner의 현재접속자(session.id)와 product.userId 비교
  const isOwner = await getIsOwner(product.userId);
  //구매자 여부 확인, buyerId가 Null이면 false반환
  const isBuyer = product.buyerId ? await getIsBuyer(product.buyerId) : false;
  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={product.photo}
          className="object-cover"
          alt={product.title}
        />
        <div className="absolute top-4 left-4 z-50 rounded-full bg-black/50 p-2 font-semibold">
          <Link href={"/home"}>
            <ChevronLeftIcon className="size-6 text-white" />
          </Link>
        </div>
        {product.status !== "for_sale" && (
          <div className="absolute z-10 h-full w-full bg-black/40 text-2xl font-semibold text-neutral-200">
            <span className="flex h-full items-center justify-center">
              {product.status === "reserved" ? "예약중" : "판매완료"}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 border-b border-neutral-700 p-5">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              alt={product.user.username}
              width={40}
              height={40}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <h3>{product.user.username}</h3>
      </div>
      <div className="flex flex-col gap-3 p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="text-lg">{product.description}</p>
      </div>

      <div className="fixed bottom-0 left-0 z-30 flex w-full items-center justify-between bg-neutral-800 p-5 pb-10 text-sm sm:text-base md:text-lg">
        <span className="text-lg font-semibold">
          {formatToWon(product.price)}원
        </span>

        <div className="flex items-center gap-2">
          {isOwner ? (
            <>
              <Link
                className="flex items-center rounded-md bg-orange-500 p-1 px-2 font-semibold text-white"
                href={`/products/${productId}/edit`}
              >
                Update Products
              </Link>
              <DeleteButton productId={productId} />
            </>
          ) : null}

          {!isOwner && (
            <form action={createChatRoom}>
              {/*히든 인풋으로 productId를 action.tsx로 전달*/}
              <input type="hidden" name="productId" value={productId} />
              <button className="flex items-center rounded-md bg-orange-500 p-1 px-2 font-semibold text-white">
                채팅하기
              </button>
            </form>
          )}
          {(isOwner || isBuyer) && (
            <ProductActions
              productId={productId}
              isBuyer={isBuyer}
              status={product.status} //DB에서 조회한 상품의 현재 판매 상태
              buyerId={product.buyerId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

//지정PAGE를 빌드시점에 static으로 생성해줌
export async function generateStaticParams() {
  "use cache";
  cacheLife("seconds");
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });
  if (!products.length) return [{ id: "1" }]; // DB가 비었을 경우 빈배열 생성(빌드에러방어코드)
  return products.map((product) => ({ id: product.id + "" })); //id를 string으로 변환, URL 매칭을 위함
}
