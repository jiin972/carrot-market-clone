"use client";

import { useFormStatus } from "react-dom";

interface IButtonProps {
  text: string;
}

export default function Button({ text }: IButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      className={`btn-primary h-10 disabled:bg-neutral-400 disabled:text-neutral-300 
        disabled:cursor-not-allowed`}
      disabled={pending}
    >
      {pending ? "로딩 중..." : text}
    </button>
  );
}
