"use server"; //해당 함수가 서버에서만 실행되게 해줌

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

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
  if (!session) return;
  await db.comment.create({
    data: {
      postId: postId,
      userId: session.id!,
      payload,
    },
  });
  revalidateTag(`comments-${postId}`, { expire: 0 });
}

//Comment DB모델 변경(삭제)를 위한 서버액션 코드 구현
//props: commentId
export async function deleteComment(commentId: number, postId: number) {
  const session = await getSession();
  await db.comment.delete({
    where: {
      id: commentId, //Number형식, JSX호출시 string변환필요
      userId: session.id,
    },
  });
  revalidateTag(`comments-${postId}`, { expire: 0 });
}

//Comment DB모델 변경(업데이트)를 위한 서버액션 코드 구현
export async function updateComment(prevState: any, formData: FormData) {
  const session = await getSession();
  const commentId = Number(formData.get("commentId"));
  const userId = Number(formData.get("userId"));
  const postId = Number(formData.get("postId"));
  const payload = formData.get("payload")?.toString();
  if (!session) return;
  await db.comment.update({
    where: {
      id: commentId,
      userId: userId,
    },
    data: {
      payload: payload,
    },
  });
  revalidateTag(`comments-${postId}`, { expire: 0 });
}

//Post DB모델 변경(삭제)를 위한 서버액션 코드 구현
export async function deletePost(postId: number) {
  const session = await getSession();
  await db.post.delete({
    where: {
      id: postId,
      userId: session.id,
    },
  });
  //Post삭제 시
  revalidateTag("posts", { expire: 0 }); //목록갱신
  revalidateTag(`post-${postId}`, { expire: 0 }); //상세갱신
  redirect("/life");
}
