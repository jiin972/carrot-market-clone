"use client";

import { createComment } from "@/app/post/[id]/action";
import { useOptimistic, useTransition } from "react";
import TimeAgo from "./time-ago";

interface CommentSectionProps {
  comments: {
    postId: number;
    id: number;
    created_at: Date;
    updated_at: Date;
    userId: number;
    payload: string;
    user: {
      username: string;
      avatar: string | null;
    };
  }[];

  postId: number;
}

//addOptimiscit(reducerFn)의 payload타입 정의(객체임)
type Comment = CommentSectionProps["comments"][0]; //[0]= 배열의 첫번째 요소타입(댓글 객체 하나)

export default function CommentSection({
  comments,
  postId,
}: CommentSectionProps) {
  //button 로딩상태 적용
  const [isPending, startTransition] = useTransition();
  //useOptimistic Hook 적용
  const [optimisticComments, addOptimistic] = useOptimistic<Comment[], Comment>(
    comments,
    (prevState, payload) => [...prevState, payload],
  );

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      // await new Promise((resolve) => setTimeout(resolve, 5000)); //커맨트 로딩 테스트
      const newComment = data.get("payload")?.toString(); //formData에서 추출
      addOptimistic({
        //form에서 추출한 payload(string)와 addOptimistic의 payload(객체)다름
        //따라서, payload(댓글객체)의 임시타입정의
        id: Date.now(),
        postId: postId,
        created_at: new Date(),
        updated_at: new Date(),
        userId: 0,
        payload: newComment ?? "",
        user: {
          username: "me",
          avatar: null,
        },
      }); //optimistic reducerFn호출
      await createComment(postId, newComment ?? ""); //action함수 호출
    });
  };
  return (
    <>
      {optimisticComments.length > 0 ? (
        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-2  ">
            {optimisticComments.map((comment) => (
              <div
                key={comment.id}
                className="w-full px-2 py-1 flex flex-col gap-1 border border-neutral-600 rounded-md"
              >
                <div className="flex items-center gap-5">
                  {comment.user.avatar ? (
                    <img
                      src={comment.user.avatar}
                      className="size-7 rounded-full"
                    />
                  ) : (
                    <div className=" flex items-center justify-center size-7 rounded-full bg-neutral-500 ">
                      <span className=" text-white font-semibold">
                        {comment.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col w-full *:text-sm ">
                    <div className="font-semibold">{comment.user.username}</div>
                    <TimeAgo time={comment.created_at.toString()} />
                  </div>
                </div>
                <div key={comment.id} className="mt-2 text-xl font-semibold">
                  <span>{comment.payload}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <form action={onSubmit} className="w-full flex gap-3">
        <input
          type="text"
          name="payload" //반드시 name을 지정해 줘야함
          className="w-full flex-1 bg-transparent text-white rounded-md border border-neutral-600 px-2"
        />
        <button
          disabled={isPending}
          type="submit"
          className="px-4 py-2 bg-orange-500 rounded-md text-white text-sm"
        >
          {isPending ? "작성중" : "작성"}
        </button>
      </form>
    </>
  );
}
