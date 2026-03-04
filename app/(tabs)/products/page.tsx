//비동기 함수(getProducts)생성
const getProducts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 10000));
};

//함수의 비동기화
export default async function Products() {
  const products = await getProducts();
  return (
    <div>
      <h1 className="text-white text-4xl">Products!</h1>
    </div>
  );
}
