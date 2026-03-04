async function getProduct() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
}

//비동기 함수로 params에서 id를 꺼냄(params는 Promise임)
export default async function ProductsDeatail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct();
  return <span>Product detail of the product {id}</span>;
}
