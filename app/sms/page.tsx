"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useActionState } from "react";
import { smsLogInState } from "./action";

const initialState = {
  token: false,
};

export default function SMSLogin() {
  const [state, dispatch] = useActionState(smsLogInState, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6 ">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-2 ">
        <Input
          name="phone_number"
          required
          type="text" //phone number 타입은 text
          placeholder="Phone number"
        />
        {state.token ? (
          <Input
            name="token"
            required
            type="number"
            placeholder="Verification code"
            min={100000}
            max={999999}
          />
        ) : null}

        <Button text="Verify" />
      </form>
    </div>
  );
}
