"use client";

import { formatToTimeAgo } from "@/lib/util";

export default function TimeAgo({ time }: { time: string }) {
  return (
    <div>
      <span>{formatToTimeAgo(time)}</span>
    </div>
  );
}
