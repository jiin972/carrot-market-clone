import TimeAgo from "@/components/time-ago";
import db from "@/lib/db";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/solid";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";

async function getPosts() {
  "use cache";
  cacheLife("seconds");
  cacheTag("posts");
  // await new Promise((resolve) => setTimeout(resolve, 5000)); //스켈레톤 테스트 코드 작성
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
    orderBy: {
      created_at: "desc", //최신순으로 게시물 정렬
    },
  });
  return posts;
}

export const metadata = {
  title: "동네생활",
};

export default async function Life() {
  const posts = await getPosts();
  return (
    <div className="p-5 flex flex-col w-full">
      <div className="flex justify-end">
        <Link
          className="px-4 py-2 flex  mb-5 bg-orange-500 rounded-md text-white font-semibold"
          href={"/post/create"}
        >
          <span>글쓰기</span>
        </Link>
      </div>

      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`} //라우터 경로와 일치확인 필수
          className={`pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex flex-col
            last:pb-0 last:border-b-0
            `}
        >
          <h2 className="text-white text-lg font-semibold">{post.title}</h2>
          <p className="mb-2">{post.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center ">
              <TimeAgo time={post.created_at.toString()}></TimeAgo>
              <span>🢝</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex gap-4 items-center *:flex *:gap-4 *:items-center">
              <span>
                <HandThumbUpIcon className="size-4" />
                {post._count.likes}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />
                {post._count.comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
