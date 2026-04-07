"use client";

import { createPost } from "@/app/post/create/action";
import { useActionState } from "react";
import GoBackButton from "./back-button";

//action.tsx(포스트 생성)의 결과를
//UI로 전달하기위한 클라이언트 컴포넌트 생성
export default function CreatePostForm() {
  //ActionState정의
  const [state, dispatch] = useActionState(createPost, null);

  return (
    <form
      action={dispatch}
      className="w-full flex flex-col gap-5 p-2 rounded-md"
    >
      <div className="flex flex-col items-start gap-5">
        <span className="text-sm text-neutral-400">Title</span>

        <input
          type="text"
          name="title"
          className="P-2 w-full bg-transparent border-0 border-b-2 border-neutral-700"
        />
        {state?.fieldErrors.title && (
          <span className="text-red-500 text-sm">
            {state.fieldErrors.title}
          </span>
        )}
      </div>
      <div className="flex flex-col items-starts">
        <span className="text-sm text-neutral-400">Description</span>
        <textarea
          name="description"
          className="p-2 w-full h-62 bg-transparent border rounded-md border-neutral-700"
        />
      </div>
      {state?.fieldErrors.description && (
        <span className="text-red-500 text-sm">
          {state.fieldErrors.description}
        </span>
      )}
      <div className="flex justify-center gap-5 mt-10">
        <button
          type="submit"
          className="px-4 py-2 flex items-center bg-orange-400 rounded-md text-white font-semibold hover:bg-orange-500 cursor-pointer"
        >
          입력완료
        </button>
        <GoBackButton />
      </div>
    </form>
  );
}
