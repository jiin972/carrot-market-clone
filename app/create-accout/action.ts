"use server";

import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";

const checkUsername = (username: string) => !username.includes("potato");
const checkPassword = ({ password, confirm_password }: any) =>
  password === confirm_password;

//db validation
const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      // username: username, //from db, from zod input
      username,
    },
    select: {
      id: true,
    },
  });
  // if (user) {
  //   return false;
  // } else {
  //   return true;
  // }
  // return user ? false : true;
  return !Boolean(user);
};

const checkEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      // email: email,
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, "필수 입력입니다.")
      .min(5, "5자 이상으로 입력합니다.")
      // .max(10, "10자 이하로 입력합니다.")
      .trim()
      .refine(checkUsername)
      .refine(checkUniqueUsername, "This username is already taken"),
    // .transform((username) => `🔥${username}🔥`)
    email: z
      .email("이메일 형식이 아닙니다.") //z.string()없어도 email은 ok.//
      .toLowerCase()
      .refine(
        checkEmail,
        "There is ans account already registered with that Email.",
      ),
    password: z.string().min(PASSWORD_MIN_LENGTH, "5자 이상으로 입력합니다."),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "5자 이상으로 입력합니다."),
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
  const result = await formSchema.safeParseAsync(data);
  // console.log(result);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return {
      fieldErrors: flatten.fieldErrors,
    };
  } else {
  }

  // check if username taken.
  // check if email is already used.
  // - false -> hash passowrd
  // save the user to db
  // log the user in
  // redirect "/home"
};
