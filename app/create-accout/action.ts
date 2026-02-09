"use server";

import { z } from "zod";

const checkUsername = (username: string) => !username.includes("potato");
const checkPassword = ({ password, confirm_password }: any) =>
  password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, "필수 입력입니다.")
      .min(5, "5자 이상으로 입력합니다.")
      .max(10, "10자 이하로 입력합니다.")
      .refine(checkUsername, "'potato'란 단어는 허용되지 않습니다."),
    email: z.email("이메일 형식이 아닙니다."), //z.string()없어도 email은 ok.
    password: z
      .string()
      .min(5, "5자 이상으로 입력합니다.")
      .max(10, "10자 이하로 입력합니다."),
    confirm_password: z
      .string()
      .min(5, "5자 이상으로 입력합니다.")
      .max(10, "10자 이하로 입력합니다."),
  })
  .refine(checkPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirm_password"], //path를 통해 에러의 경로를 찾음
  });

export const createAccount = async (prevState: any, formData: FormData) => {
  const data = {
    username: formData.get("username") ?? "",
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = formSchema.safeParse(data);
  console.log(result);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return {
      fieldErrors: flatten.fieldErrors,
    };
  }
};
