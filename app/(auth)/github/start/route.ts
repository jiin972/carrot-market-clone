import { redirect } from "next/navigation";

export function GET() {
  const baseURL = "https://github.com/login/oauth/authorize";
  //파라메터 작성, 값은 string
  const params = {
    client_id: process.env.GITHUB_OAUTH_CLIENTID!, // .env에 있음을 확인!
    scope: "read:user, read:email",
    allow_signup: "false",
  };

  const formattedParams = new URLSearchParams(params).toString();
  const finalURL = `${baseURL}?${formattedParams}`;

  return redirect(finalURL);
}
