import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/cache";
import Link from "next/link";

//비동기 함수(getProducts)생성 - InitialProduct용
//db.product를 findMany로 데이터 추출
async function getInitialProducts() {
  "use cache"; // 캐시 사용
  cacheLife("minutes"); // 갱신주기 설정
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1, // 가져올 수량
    orderBy: {
      created_at: "desc", //데이터 정렬조건 생성, "asc or desc"
    },
  });
  //user products를 return
  return products;
}

//initialProducts의 타입을 prisma를 이용해 export
export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

//Home의 메타데이터 생성
export const metadata = {
  title: "Home",
};

//함수의 비동기화
//prop은 {...products}의 전개연산자로 db data  전달
export default async function Products() {
  const initialProducts = await getInitialProducts(); //최초 페이지만 노출되도록 수정(3/6)
  //revalidatePath 테스트 코드
  // const revalidate = async () => {
  //   "use server";
  //   revalidatePath("/home");
  // };
  return (
    <div>
      <Link href="/home/recent">Recent Products</Link>
      {/* <form action={revalidate}>
        <button className="cursor-pointer">데이터 갱신</button>
      </form> */}
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/home/add"
        className="bg-orange-600 flex justify-center items-center rounded-full size-16 fixed bottom-24 right-7 text-white transition-color hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
