"use client";

import { updatePost } from "@/app/post/[id]/edit/action";
import GoBackButton from "./back-button";
import { useActionState } from "react";

//post의 타입정의(전달될 props는 객체)
interface EditPostFormProps {
  post: {
    id: number;
    title: string;
    description: string | null;
    userId: number;
  };
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const [state, dispatch] = useActionState(updatePost, null);
  return (
    <div className="p-5 w-full">
      <form className="flex flex-col gap-5" action={dispatch}>
        <div className="flex flex-col items-start gap-5">
          <span>Title</span>
          <input
            className="P-2 w-full bg-transparent border-0 border-b-2 border-neutral-700"
            type="text"
            name="title"
            defaultValue={post.title}
          />
        </div>
        {state?.fieldError.title && (
          <span className="text-red-500 text-sm">{state.fieldError.title}</span>
        )}
        <div className="flex flex-col items-start gap-5">
          <span>Description</span>
          {post.description && (
            <input
              type="text"
              name="description"
              defaultValue={post.description}
              className="P-2 w-full bg-transparent border-0 border-b-2 border-neutral-700"
            />
          )}
          {/*히든 input으로 postId를 action prop으로 전달*/}
          <input type="hidden" name="postId" value={post.id} />
          {state?.fieldError.description && (
            <span className="text-red-500 text-sm">
              {state.fieldError.description}
            </span>
          )}
        </div>
        <div className="mt-10 flex gap-5 justify-center">
          <button
            type="submit"
            className="px-4 py-2 flex items-center bg-orange-400 rounded-md text-white font-semibold hover:bg-orange-500 cursor-pointer"
          >
            수정완료
          </button>
          <GoBackButton />
        </div>
      </form>
    </div>
  );
}
