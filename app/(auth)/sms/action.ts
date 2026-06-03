"use server";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import validator from "validator";
import { z } from "zod";
import crypto from "crypto";

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

const tokenSchema = z.coerce.number().min(100000).max(999999);

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
      // send the token using twilio
      return {
        token: true,
      };
    }
  } else {
    //token입력란 표시 이후 단계
    const result = tokenSchema.safeParse(tokenData);
    if (!result.success) {
      const tokenFlatten = z.flattenError(result.error);
      return {
        token: true, // UI(token입력창)는 유지
        error: tokenFlatten,
      };
    } else {
      //로그인 유지를 위해 아무것도 return하지 않음
      redirect("/");
    }
  }
};
