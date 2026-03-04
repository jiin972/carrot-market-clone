"use server";
import { redirect } from "next/navigation";
import validator from "validator";
import { z } from "zod";

export interface ISmsLogInState {
  token: boolean;
  error?: z.ZodFlattenedError<string | number>;
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
      const phobeFlatten = z.flattenError(result.error);
      console.log("폰에러:", phobeFlatten);
      return {
        token: false,
        error: phobeFlatten,
      };
    } else {
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
