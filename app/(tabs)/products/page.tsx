import ListProduct from "@/components/list-product";
import db from "@/lib/db";

//비동기 함수(getProducts)생성
//db.product를 findMany로 데이터 추출
async function getProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
  });
  //user products를 return
  return products;
}

//함수의 비동기화
//prop은 {...products}의 전개연산자로 db data  전달
export default async function Products() {
  const products = await getProducts();
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
    </div>
  );
}
