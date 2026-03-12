export default async function Loading() {
  return (
    <div className="fixed w-full h-full bg-gray-700/10 flex items-center justify-center left-0 top-0 z-50 backdrop-blur-sm">
      <div className="relative max-w-3xl h-[500px] w-full">
        <div className="w-full h-full bg-neutral-900 rounded-md flex overflow-hidden shadow-2xl border border-neutral-800">
          {/* 왼쪽 이미지 스켈레톤 */}
          <div className="flex-1 bg-neutral-800 animate-pulse" />

          {/* 오른쪽 정보 스켈레톤 */}
          <div className="flex-1 flex flex-col justify-between p-6 gap-4">
            {/* 제목 */}
            <div className="h-8 w-3/4 bg-neutral-700 rounded-md animate-pulse" />

            {/* 작성자 */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-neutral-700 animate-pulse" />
              <div className="h-4 w-24 bg-neutral-700 rounded-md animate-pulse" />
            </div>

            {/* 설명 */}
            <div className="flex flex-col gap-2 border-t border-neutral-700 pt-4">
              <div className="h-4 w-full bg-neutral-700 rounded-md animate-pulse" />
              <div className="h-4 w-2/3 bg-neutral-700 rounded-md animate-pulse" />
            </div>

            {/* 가격 + 날짜 */}
            <div className="flex flex-col gap-2 mt-auto">
              <div className="h-8 w-1/3 bg-neutral-700 rounded-md animate-pulse" />
              <div className="h-3 w-1/4 bg-neutral-700 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
