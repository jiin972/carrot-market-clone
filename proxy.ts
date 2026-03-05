import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

//publicOnlyUrls의 interface생성
interface Routes {
  [key: string]: boolean;
}

//로그인 되지 않은 user가 가야하는 페이지 목록(이외에는 제한됨)
//검색속도를 위해 object로 생성(boolean)
const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
};

//middleware에서 proxy로 공식 명칭이 변경됨
//Edge runtime: 모든 요청을 가로채고 초고속 실행, 무거운 작업 불가
export async function proxy(request: NextRequest) {
  const session = await getSession(); // 페이지 이동마다 쿠키를 호출함
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  //user 로그아웃 상태
  if (!session.id) {
    //로그아웃 user의 이동경로 제한
    if (!exists) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  //user 로그인 상태
  else {
    // 로그인한 user의 이동경로 설정(ex)"/create-account"등 publicOnlyUrls는 제한)
    // 즉, 불필요한 이동은 제한 함
    if (exists) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }
}

//특정 파일, url, api에서 middleware제외 되도록 Regex정의
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],

  //특정 경로 검사시
  //matcher:["/", "/profile"]
};
