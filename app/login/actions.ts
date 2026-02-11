"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import z from "zod";

interface ILogInState {
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
  data?: any;
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
  const result = formSchema.safeParse(data);
  console.log(result.data);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    console.log("에러:", flatten.fieldErrors);
    return {
      fieldErrors: flatten.fieldErrors,
    };
  } else {
    console.log("성공:", result.data);
    return {
      data: result.data,
    };
  }
};
