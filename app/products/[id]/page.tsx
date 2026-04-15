import { createChatRoom } from "@/app/chats/action";
import DeleteButton from "@/components/delete-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/util";
import { UserIcon } from "@heroicons/react/16/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

//동적 metadata생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  const product = await getProductTitle(productId); //dataBase에 id를 통한 상품조회 query(요청)
  return {
    title: `🥕 ${product?.title}`,
  };
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
  const isOwner = await getIsOwner(product.userId); //getIsOwner의 현재접속자(session.id)와 product.userId 비교

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={product.photo}
          className="object-cover"
          alt={product.title}
        />
        <div className="absolute top-4 left-4 bg-black/50 p-2 rounded-full font-semibold">
          <Link href={"/home"}>
            <ChevronLeftIcon className="size-6 text-white " />
          </Link>
        </div>
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full overflow-hidden">
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
      <div className="p-5 flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="text-lg">{product.description}</p>
      </div>

      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-lg">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <>
            <Link
              className="bg-orange-500 p-5 rounded-md text-white font-semibold"
              href={`/products/${productId}/edit`}
            >
              Update Products
            </Link>
            <DeleteButton productId={productId} />
          </>
        ) : null}

        <form action={createChatRoom}>
          {/*히든 인풋으로 productId를 action.tsx로 전달*/}
          <input type="hidden" name="productId" value={productId} />
          <button className="bg-orange-500 p-5 rounded-md text-white font-semibold">
            채팅하기
          </button>
        </form>
      </div>
    </div>
  );
}

//지정PAGE를 빌드시점에 static으로 생성해줌
export async function generateStaticParams() {
  "use cache";
  cacheLife("minutes");
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });
  return products.map((product) => ({ id: product.id + "" })); //id를 string으로 변환, URL 매칭을 위함
}
