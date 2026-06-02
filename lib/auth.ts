import getSession from "./session";

//세션 생성 및 저장
export async function createSession(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}
