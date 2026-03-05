import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/util";
import { UserIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import deleteProduct from "./action";

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
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-lg">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <form action={deleteProduct.bind(null, productId)}>
            <button className="bg-red-500 p-5 rounded-md text-white font-semibold">
              Delete Product
            </button>
          </form>
        ) : null}
        <Link
          href={""}
          className="bg-orange-500 p-5 rounded-md text-white font-semibold"
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}
