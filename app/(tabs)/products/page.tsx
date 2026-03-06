import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

//비동기 함수(getProducts)생성 - InitialProduct용
//db.product를 findMany로 데이터 추출
async function getInitialProducts() {
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

//함수의 비동기화
//prop은 {...products}의 전개연산자로 db data  전달
export default async function Products() {
  const initialProducts = await getInitialProducts(); //최초 페이지만 노출되도록 수정(3/6)
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
    </div>
  );
}
