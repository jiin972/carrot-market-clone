import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

interface SessionContent {
  id?: number;
}

//iron-session initialize
export default async function getSession() {
  return getIronSession<SessionContent>(await cookies(), {
    cookieName: "delicious-karrot",
    password: process.env.COOKIE_PASSWORD!,
    cookieOptions: {
      secure:
        process.env.NODE_ENV === "production" &&
        process.env.DEPLOY_URL?.startsWith("https") === true, //배포환경에서만 HTTPS 보안 쿠키 활성화
      httpOnly: true, //js가 쿠키를 가로채지 못하게 방어
      path: "/", //사이트 전체에서 쿠키 사용
      sameSite: "lax", //다른 탭/링크 이동 시에도 쿠키 유지
    },
  });
}
//추가 - 미들웨어(proxy)전용
export async function getProxySession(request: NextRequest) {
  return getIronSession<SessionContent>(
    request as unknown as Request, // NextRequest -> Request 캐스팅
    new Response(), //쓰기용 Response
    {
      cookieName: "delicious-karrot",
      password: process.env.COOKIE_PASSWORD!,
      cookieOptions: {
        secure: false, // 로컬 HTTP환경에서 쿠키 거부 방지
      },
    },
  );
}
