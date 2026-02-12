"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useActionState } from "react";
import { ISmsLogInState, smsLogInState } from "./action";

const initialState = {
  token: false, // 현재 ui가 "번호입력"인지, "token"입력인지 결정
  error: undefined,
};

export default function SMSLogin() {
  const [state, dispatch] = useActionState<ISmsLogInState, FormData>(
    smsLogInState,
    initialState,
  );
  return (
    <div className="flex flex-col gap-10 py-8 px-6 ">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-2 ">
        {state.token ? (
          <Input
            name="token"
            required
            type="number"
            placeholder="Verification code"
            min={100000}
            max={999999}
          />
        ) : (
          <Input
            name="phone"
            required
            type="text" //phone number 타입은 text
            placeholder="Phone number"
            errors={state.error?.formErrors}
          />
        )}

        <Button text={state.token ? "Verify Token" : "Send Verification SMS"} />
      </form>
    </div>
  );
}
