"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import z from "zod";
import { required } from "zod/mini";

interface ILogin {
  errors: string[];
}

const formSchema = z.object({
  email: z.email("이메일 형식이 아닙니다.").toLowerCase(),
  password: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "field required" : "invalid input",
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export const login = async (prevState: ILogin | null, FormData: FormData) => {
  const data = {
    email: FormData.get("email"),
    password: FormData.get("password"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return {
      fieldErrors: flatten.fieldErrors,
    };
  }
};
