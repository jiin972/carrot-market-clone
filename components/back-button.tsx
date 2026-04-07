"use client";

import { useRouter } from "next/navigation";

//입력취소 버튼(뒤로가기) 로직구현 - 재사용 가능
export default function GoBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="px-4 py-2 flex items-center bg-orange-400 rounded-md text-white font-semibold hover:bg-orange-500 cursor-pointer"
    >
      입력취소
    </button>
  );
}
