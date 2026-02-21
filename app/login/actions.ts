"use server";

import db from "@/lib/db";
import z from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

interface ILogInState {
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
  data?: any;
}

//DB내 email 체크
const checkEmailExist = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
  // return user ? true : false;
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .email("이메일 형식이 아닙니다.")
    .toLowerCase()
    .refine(checkEmailExist, "An account with this Email does not exits."),
  password: z.string({
    error: (iss) =>
      iss.input === undefined ? "field required" : "invalid input",
  }),
  // .min(PASSWORD_MIN_LENGTH),
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

//dispatch function
export const logInState = async (
  prevState: ILogInState | null,
  formData: FormData,
): Promise<ILogInState | null> => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  //data를 formSchema로 parse
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return {
      fieldErrors: flatten.fieldErrors,
    };
  } else {
    // if the user is found, check password hash
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(result.data.password, user!.password ?? "");
    // log the user in
    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          email: [],
          password: ["Worng password"],
        },
      };
    }
    // redirect "/profile"
  }
};
