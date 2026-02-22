"use server";

import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { email, z } from "zod";

const checkUsername = (username: string) => !username.includes("potato");
const checkPassword = ({ password, confirm_password }: any) =>
  password === confirm_password;

//DB validation

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, "필수 입력입니다.")
      .min(5, "5자 이상으로 입력합니다.")
      .trim()
      .refine(checkUsername),

    email: z
      .email("이메일 형식이 아닙니다.") //z.string()없어도 email은 ok.//
      .toLowerCase(),

    password: z.string().min(PASSWORD_MIN_LENGTH, "5자 이상으로 입력합니다."),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "5자 이상으로 입력합니다."),
  })
  .superRefine(async ({ username, email, password, confirm_password }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken",
        path: ["username"],
      });
      return z.NEVER;
    }
    const emailExists = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (emailExists) {
      ctx.addIssue({
        code: "custom",
        message: "This E-mail is already taken",
        path: ["email"],
      });
      return z.NEVER;
    }

    if (password !== confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirm_password"],
      });
    }
  });

export const createAccount = async (prevState: any, formData: FormData) => {
  const data = {
    username: formData.get("username") ?? "",
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  // alias safeParseAsyncc = sap
  const result = await formSchema.spa(data);
  if (!result.success) {
    console.log(z.flattenError(result.error));
    const flatten = z.flattenError(result.error);
    return {
      fieldErrors: flatten.fieldErrors,
    };
  } else {
    // paswword Hashig(promise type)
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    //Save user DB
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    const session = await getSession(); // 사용자 로그인 상태 검사
    // add to data in session from prisma(data=ID)
    session.id = user.id;
    await session.save();

    redirect("/profile");
  }
};
