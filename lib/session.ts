import "server-only";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

interface SessionContent {
  id?: number;
}

//common cookie option
const getCookieOption = () => {
  return {
    cookieName: "delicious-karrot",
    password: process.env.COOKIE_PASSWORD!,
    cookieOptions: {
      //vercel 배포환경(production)이면 무조건 true(HTTPS 보안 적)
      secure: process.env.NODE_ENV === "production",
      httpOnly: true, //js가 쿠키를 가로채지 못하게 방어
      path: "/", //사이트 전체에서 쿠키 사용
      sameSite: "lax", //다른 탭/링크 이동 시에도 쿠키 유지
    },
  };
};
//iron-session initialize
export default async function getSession() {
  return getIronSession<SessionContent>(await cookies(), getCookieOption());
}
//추가 - 미들웨어(proxy)전용
export async function getProxySession(request: NextRequest) {
  return getIronSession<SessionContent>(
    request as unknown as Request, // NextRequest -> Request 캐스팅
    new Response(), //쓰기용 Response
    getCookieOption(), // middleware에서도 배포환경에 맞게 scure옵션 켬
  );
}
