"use server";
import validator from "validator";
import z from "zod";

interface ISmsLogInState {
  token: boolean;
} //prevState 타입정의하기

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, "ko-KR"));
const tokenSchema = z.coerce.number().min(100000).max(999999);

export const smsLogInState = async (
  prevState: ISmsLogInState,
  formData: FormData,
) => {
  const phoneData = formData.get("phone");
  const token = formData.get("token");
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phoneData);
    if (!result.success) {
      return {
        token: false,
      };
    } else {
      return {
        token: true,
      };
    }
  }
};
