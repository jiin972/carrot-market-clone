"use client";

import { formatToTimeAgo } from "@/lib/util";

// TimeAgo: Date객체는 런타임 요소라 "use cache"안에서 사용불가
// -> "use client" 컴포넌트로 분리해서 클라이언트에서 처리
export default function TimeAgo({ time }: { time: string }) {
  return (
    <div>
      <span className="text-xs">{formatToTimeAgo(time)}</span>
    </div>
  );
}
