import { boolean } from "zod";

//code를 받아 acceesToken요청, access_token반환
export async function getAccessToken(
  code: string,
): Promise<{ error: string | undefined; access_token: string }> {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_OAUTH_CLIENTID!,
    client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET!,
    code: code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  //json으로 파싱 후, access_token/error반환
  const { error, access_token } = await accessTokenResponse.json();
  return { error, access_token };
}

//access_token을 받아 {id, avatar_url, login}반환
export async function getGithubUserProfile(access_token: string): Promise<{
  id: number;
  avatar_url: string;
  login: string;
}> {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  //access_token교환, json으로 파싱 후 id,avatar_url,login반환
  const { id, avatar_url, login } = await userProfileResponse.json();
  return { id, avatar_url, login };
}

//access_token을 받아 primary email주소 반환
export async function getGithubUserEmail(
  access_token: string,
): Promise<{ primaryEmail: string | undefined }> {
  const userEmailResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await userEmailResponse.json();
  //GithubAPI가 에러발생시 객체 반환,(정상일 경우 배열 반환)
  //이때, 반환data가 배열이 아닌 경우,find사용불가(에러발생)
  // undefined방어코드 작성
  if (!Array.isArray(data)) {
    return { primaryEmail: undefined };
  }
  const emails: { email: string; primary: boolean }[] = data; //배열확정 시 타입규정
  const primaryEmail = emails.find((email) => email.primary);
  return { primaryEmail: primaryEmail?.email }; //email문자열만 반환, 없으면 undefined
}
