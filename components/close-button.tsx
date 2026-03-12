"use client";

import { XMarkIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

//props을 받지 않음
export default function CloseButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="absolute right-5 top-5 text-neutral-200"
    >
      <XMarkIcon className="size-10" />
    </button>
  );
}
