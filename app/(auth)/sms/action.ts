"use server";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import validator from "validator";
import { z } from "zod";
import crypto from "crypto";
import getSession from "@/lib/session";

export interface ISmsLogInState {
  token: boolean;
  error?: z.ZodFlattenedError<string | number>;
}

//토큰 생성 함수 createToken()
async function createToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const existToken = await db.sMSToken.findUnique({
    where: {
      token: token,
    },
    select: {
      id: true,
    },
  });
  if (existToken) {
    return createToken(); // 중복 토큰 존재 시 재귀 호출로 삭제하지 않고 새 토큰 생성
  } else {
    return token; //중복 token이 없을 경우 token 반환
  }
}

//prevState 타입정의하기
const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format",
  );

//입력된 토큰의 존재 검증(DB조회)
async function tokenExist(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists); //refine은 truthy or falsy로 통과여부 판단
}

//입력된 토큰의 형식 검증
const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExist, "이 토큰은 유효하지 않습니다.");

export const smsLogInState = async (
  prevState: ISmsLogInState,
  formData: FormData,
): Promise<ISmsLogInState> => {
  const phoneData = formData.get("phone");
  const tokenData = formData.get("token"); //formData에서 받아온 6자리 숫자

  //UI표시(token입력란) 여부 결정 단계
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phoneData);
    if (!result.success) {
      const phoneFlatten = z.flattenError(result.error);
      console.log("폰에러:", phoneFlatten);
      return {
        token: false,
        error: phoneFlatten,
      };
    } else {
      // 기존 토큰 삭제 (같은 phone의 토큰 전부 제거)
      // 보안 향상 및 DB의 불필요한 데이터 제거
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data, // Zod로 검증된 안전한 전화번호 데이터
          },
        },
      });
      // create token 로직
      const token = await createToken();
      await db.sMSToken.create({
        data: {
          token: token,
          user: {
            //유저 있으면 기존 유저와 connect
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              //유저 없을 경우 새 유저 create 후 연결
              create: {
                username: crypto.randomBytes(10).toString("hex"), // NOT NULL, 반드시 함께 생성해 야 함
                phone: result.data,
              },
            },
          },
        },
      });
      // send the token using twilio(다른 국내SMS 확인 후 변경예정)
      // const client = twilio(
      // process.env.TWILIO_ACCOUNT_SID,
      // process.env.TWILIO_AUTH_TOKEN
      //);
      // await client.messages.create({
      // body:`your karrot verification code is: ${token},`
      // from: process.env.TWILIO_PHONE_NUMBER!,
      // to: result.data.MY_PHONE_NUMBER! -> 원래는 result.data, parse된 전화번
      //})
      //
      console.log(token);
      return {
        token: true,
      };
    }
  } else {
    //token입력란 표시 이후 단계
    const result = await tokenSchema.safeParseAsync(tokenData); //data검증실행
    if (!result.success) {
      const tokenFlatten = z.flattenError(result.error);
      return {
        token: true, // UI(token입력창)는 유지
        error: tokenFlatten,
      };
    } else {
      //로그인 유지를 위해 아무것도 return하지 않음
      // get the userId of token
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        //로그인 + token삭제를 위한 최소한의 값 가져옴
        select: {
          id: true, //토큰 삭제용
          userId: true, //session저장 용
        },
      });
      if (token) {
        const session = await getSession();
        session.id = token.userId; //token존재 시 session에 userId 저장(로그인 처리)
        await session.save(); // 세션 유지
        //token은 1회용, 바로 삭제
        await db.sMSToken.delete({
          where: {
            id: token.id,
          },
        });
      }
      redirect("/profile");
    }
  }
};
