"use client";

import { useFormStatus } from "react-dom";

interface IFormButtonProps {
  text: string;
}

export default function FormButton({ text }: IFormButtonProps) {
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
