import TimeAgo from "@/components/time-ago";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// DB조회 및 data추출
async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id: id,
      },
      data: {
        views: {
          increment: 1, //views+1한 값으로 update
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
    return post; //DB조회 후 retunr해 줘야함
  } catch (errors) {
    return null; //errors 발생 시, 404 페이지로 보내, 없는 페이지 처리
  }
}

//현재 로그인한 user가 생성한 like를 찾는 로직
async function getIsLiked(postId: number) {
  const session = await getSession();
  const like = await db.like.findUnique({
    where: {
      id: {
        //composite ID 호출
        postId: postId,
        userId: session.id!,
      },
    },
  });
  return Boolean(like);
}

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);

  if (isNaN(postId)) return notFound(); //postId가 숫자가 아닐 경우, 404처리

  const post = await getPost(postId);
  console.log("post조회:", post);

  if (!post) return notFound(); //post가 없을 경우(null), 404처리

  const likePost = async () => {
    "use server";
    try {
      const session = await getSession();
      await db.like.create({
        data: {
          //composite ID 호출
          postId: postId,
          userId: session.id!, //미들웨어를 통해 session.id보자(로그인 검증완료)
        },
      });
      revalidatePath(`/post/${postId}`);
    } catch (errors) {}
  };
  const disLikePost = async () => {
    "use server";
    try {
      const session = await getSession();
      await db.like.delete({
        where: {
          id: {
            //composite ID 호출
            postId: postId,
            userId: session.id!, //미들웨어를 통해 session.id보장(로그인 검증완료)
          },
        },
      });
      revalidatePath(`/post/${postId}`);
    } catch (errors) {}
  };

  const isLiked = await getIsLiked(postId);

  return (
    <Suspense fallback={"로딩중.."}>
      <div className="p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Image
            width={28}
            height={28}
            src={post.user.avatar ?? ""}
            alt={post.user.username}
            className="size-7 rounded-full"
          />
          <div>
            <span className="text-sm font-semibold">{post.user.username}</span>
            <div>
              <TimeAgo time={post.created_at.toString()} />
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="mb-5">{post.description}</p>
        <div className="flex flex-col gap-5 items-start">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>조회 {post.views}</span>
          </div>
          <form action={isLiked ? disLikePost : likePost}>
            <button
              className={`flex items-center gap-2 text-neutral-500 text-sm border border-neutral-400 rounded-full p-2  transition-colors
                ${isLiked ? "bg-orange-400 text-white font-semibold border-orange-400" : "hover:bg-neutral-800"}
                `}
            >
              {isLiked ? (
                <>
                  <HandThumbUpIcon className="size-5" />
                  <span>{post._count.likes}</span>
                </>
              ) : (
                <>
                  <OutlineHandThumbUpIcon className="size-5" />
                  <span>공감하기({post._count.likes})</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Suspense>
  );
}
