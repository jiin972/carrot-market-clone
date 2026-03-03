import Link from "next/link";
import "@/lib/db";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <span className="text-9xl">🥕</span>
        <h1 className="text-4xl ">당근</h1>
        <h2 className="text-2xl">당근 마켓에 어서오세요!</h2>
      </div>
      <div className="w-full flex flex-col items-center gap-2 mb-2">
        <Link
          href="/create-account"
          className="btn-primary py-2.5 text-lg hover:no-underline"
        >
          시작하기
        </Link>
        <div className="flex gap-2 ">
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className="text-carrot-link hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
