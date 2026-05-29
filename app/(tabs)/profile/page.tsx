import getSession from "@/lib/session";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getPurchases, getReceivedReviews, getUser } from "./action";
import Link from "next/link";
import Products from "../home/page";

async function ProfileContent() {
  const user = await getUser();
  const purchases = await getPurchases();
  const soldProducts = await getReceivedReviews();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <h1>Welcom {user?.username}</h1>
        <form action={logOut}>
          <button className="text-orange-500 active:text-neutral-500 cursor-pointer">
            Log out
          </button>
        </form>
      </div>
      <h2 className="py-5 text-2xl font-semibold">구매목록</h2>
      {purchases.length > 0 ? (
        <div className="flex flex-col gap-2 items-start justify-center w-full">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="flex item gap-3">
              <Image
                className="aspect-square object-cover rounded-md"
                src={purchase.product.photo}
                alt={purchase.product.title}
                width={80}
                height={80}
              />
              <div className="flex flex-col items-start ">
                <div className="text-sm">판매자 {purchase.user.username}</div>
                {purchase.product.title}
                {purchase.product.reviews.length > 0 ? (
                  <Link href={`/review/${purchase.productId}`}>리뷰보기</Link>
                ) : (
                  <Link
                    className="text-sm bg-orange-500 text-white px-3 py-1 rounded-md0"
                    href={`/review/${purchase.productId}`}
                  >
                    리뷰작성
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-lg font py-2 px-1 text-neutral-500">
          <span>{`${user.username}님의 구매내역이 없습니다.`}</span>
        </div>
      )}

      <h2 className="py-5 text-2xl font-semibold">판매목록</h2>
      {soldProducts.length > 0 ? (
        <div className="flex flex-col gap-2 items-start justify-center w-full">
          {soldProducts.map((soldProduct) => (
            <div key={soldProduct.id} className="flex items-start gap-3">
              <Image
                className="aspect-square object-cover rounded-md"
                src={soldProduct.product.photo}
                alt={soldProduct.product.title}
                width={80}
                height={80}
              />
              <div className="flex flex-col items-start justify-self-start gap-1">
                <div className="flex gap-3">
                  <div className="text-sm">
                    작성자 {soldProduct.createdBy.username}
                  </div>
                  <div className="text-sm">
                    {"⭐️".repeat(soldProduct.rating)}
                  </div>
                </div>
                <div className="text-lg text-neutral-100 ">
                  {soldProduct.payload}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-lg font py-2 px-1 text-neutral-500">
          <span>{`${user.username}님의 판매내역이 없습니다.`}</span>
        </div>
      )}
    </div>
  );
}

export default async function Profile() {
  return (
    <Suspense fallback={"환영합니다. 잠시만 기다려 주세요."}>
      <ProfileContent />
    </Suspense>
  );
}
// async function getUser() {
//   const session = await getSession();
//   if (session.id) {
//     const user = await db.user.findUnique({
//       where: {
//         id: session.id,
//       },
//     });
//     if (user) {
//       return user;
//     }
//   }
//   notFound();
// }

// export default async function Profile() {
//   const user = await getUser();
//   const logOut = async () => {
//     "use server";
//     const session = await getSession();
//     await session.destroy();
//     redirect("/");
//   };
//   return (
//     <div>
//       <Suspense fallback={null}>
//         {" "}
//         <h1>Welcom {user?.username}</h1>
//         <form action={logOut}>
//           <button>Log out</button>
//         </form>
//       </Suspense>
//     </div>
//   );
