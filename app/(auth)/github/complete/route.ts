import { createSession } from "@/lib/auth";
import db from "@/lib/db";
import {
  getAccessToken,
  getGithubUserEmail,
  getGithubUserProfile,
} from "@/lib/github";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// 1단계, Github에 GET 요청으로 콜백
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code"); //"code"의 value추출
  if (!code) return new Response(null, { status: 400 }); //body는 null하고, status만 return
  const { error, access_token } = await getAccessToken(code);
  if (error) {
    return new Response(null, { status: 400 }); //"code"만료 시 방어코드
  }
  //Github userProfile요청 함수 호출
  const { id, avatar_url, login } = await getGithubUserProfile(access_token);

  // Github의 user Email정보 GET요청
  const { primaryEmail } = await getGithubUserEmail(access_token);
  if (!primaryEmail) {
    return new Response(null, { status: 400 });
  }
  // DB에서 이미 가입한 유저확인
  const user = await db.user.findUnique({
    where: {
      github_id: id + "", //github_id를 string으로 변환
    },
    select: {
      id: true, //select로 필요한 필드만 반환
    },
  });

  //로그인 성공 시 로그인 상태 유지 위해 session호출
  if (user) {
    await createSession(user.id);
    return redirect("/profile");
  }
  //신규 가입 시 username 중복 확인 로직(DB조회),login은 github의 username
  const existingUsername = await db.user.findUnique({
    where: {
      username: login,
    },
  });
  if (existingUsername) {
    return new Response(null, { status: 400 });
  }

  //신규 유저 생성로직 및 로그인 상태 유지
  const newUser = await db.user.create({
    data: {
      username: login, //동일한 username이 있는지 확인 필요, 코드챌린지
      github_id: id + "", //github_id를 string으로 변환
      avatar: avatar_url,
      email: primaryEmail, //email정보
    },
    select: {
      id: true, //select로 필요한 필드만 반환
    },
  });
  await createSession(newUser.id);
  return redirect("/profile");
}
