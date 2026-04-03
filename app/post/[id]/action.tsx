"use server"; //해당 함수가 서버에서만 실행되게 해줌

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

//useOptimistic훅 사용을 위해 LikeButton을 "use client"로 생성
//이때, 서버액션(서버컴포넌트아님)을 외부로부터 import 해와야함
//따라서, Like/disLike를 action.tsx로 분리함
export async function LikePost(postId: number) {
  //   await new Promise((resolve) => setTimeout(resolve, 5000)); //테스트 코드작성
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        //composite ID 호출
        postId: postId,
        userId: session.id!, //미들웨어를 통해 session.id보자(로그인 검증완료)
      },
    });
    revalidateTag(`like-status-${postId}`, { expire: 0 }); //URL에서 온 ID를 Tag의 Id로 사용
  } catch (e) {}
}

export async function disLikePost(postId: number) {
  //   await new Promise((resolve) => setTimeout(resolve, 5000)); //테스트 코드작성
  const session = await getSession();
  try {
    await db.like.delete({
      where: {
        id: {
          //composite ID 호출
          postId: postId,
          userId: session.id!, //미들웨어를 통해 session.id보장(로그인 검증완료)
        },
      },
    });
    revalidateTag(`like-status-${postId}`, { expire: 0 });
  } catch (e) {}
}

//Comment DB모델 변경(쓰기)를 위한 서버액션 코드 구현
//Props: postId,
export async function createComment(postId: number, payload: string) {
  const session = await getSession();
  await db.comment.create({
    data: {
      postId: postId,
      userId: session.id!,
      payload,
    },
  });
  revalidateTag(`comments-${postId}`, { expire: 0 });
}
