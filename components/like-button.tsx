"use client";

import { disLikePost, LikePost } from "@/app/post/[id]/action";
import { HandThumbUpIcon } from "@heroicons/react/16/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { startTransition, useOptimistic } from "react";

interface LikeButtonProps {
  isLieked: boolean;
  likeCount: number;
  postId: number;
}

//useOptimistic Hook사용을 위해 client컴포넌트로 분리
//Props: isLiked, likeCount, postId(URL params:number)
export default function LikeButton({
  isLieked,
  likeCount,
  postId,
}: LikeButtonProps) {
  //useOptimistic Hook정의
  const [state, reducerFn] = useOptimistic(
    { isLieked, likeCount },
    (previousState, payload) => {
      return {
        //reducer은 반드시 return해야함
        isLieked: !previousState.isLieked,
        likeCount: previousState.isLieked
          ? previousState.likeCount - 1
          : previousState.likeCount + 1,
      };
    },
  );

  // 클릭 시 UI 즉시 업데이트(Optimistic) + 서버 액션 실행
  const onClick = async () => {
    startTransition(async () => {
      //useOptimistic업데이트는 transition안에서 반드시 실행되어야 함
      reducerFn(undefined); //reducerFn 사용(reducer를 실행시키는 트리거), UI 즉시 업데이트(optimistic)
      if (isLieked) {
        await disLikePost(postId);
      } else {
        await LikePost(postId);
      }
    });
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-neutral-500 text-sm border border-neutral-400 rounded-full p-2  transition-colors
                      ${state.isLieked ? "bg-orange-400 text-white font-semibold border-orange-400" : "hover:bg-neutral-800"}
                      `}
    >
      {state.isLieked ? (
        <>
          <HandThumbUpIcon className="size-5" />
          <span>{state.likeCount}</span>
        </>
      ) : (
        <>
          <OutlineHandThumbUpIcon className="size-5" />
          <span>공감하기({state.likeCount})</span>
        </>
      )}
    </button>
  );
}
