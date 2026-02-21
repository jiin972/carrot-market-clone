"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useActionState } from "react";
import { logInState } from "./actions";

export default function LogIn() {
  const [state, dispatch] = useActionState(logInState, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6 ">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-2 ">
        <Input
          name="email"
          required
          type="email"
          placeholder="Email"
          errors={state?.fieldErrors?.email} //zod가 검증 실패 시 생성한 에러 메시지 배열(Action에서 전달)
        />
        <Input
          name="password"
          required
          type="password"
          placeholder="Password"
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors?.password} //zod가 검증 실패 시 생성한 에러 메시지 배열(Action에서 전달)
        />
        <Button text="Log in" />
      </form>
      <SocialLogin />
    </div>
  );
}
