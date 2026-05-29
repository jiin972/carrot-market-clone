import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

//구매목록 조회
export async function getPurchases() {
  const session = await getSession();
  const userId = session.id;
  //DB purchase 조회, 여러 상품일 경우 대비(findMany)
  const purchased = await db.purchase.findMany({
    where: {
      userId: userId,
    },
    include: {
      product: {
        include: {
          //내가 쓴 리뷰만 필터링(배열로 반환)
          //review.length > 0이면 이미 리뷰작성한 상품품
          reviews: {
            where: {
              createdById: session.id,
            },
          },
        },
      },
      user: true,
    },
  });
  return purchased;
}

//User정보 조회
export async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}
