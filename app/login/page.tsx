"use client";

import FormButton from "@/components/form-button";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { useActionState } from "react";
import { handleForm } from "./actions";

export default function Login() {
  const [state, action] = useActionState(handleForm, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6 ">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-2 ">
        <FormInput
          required
          type="email"
          placeholder="Email"
          errors={[]}
          name="email"
        />
        <FormInput
          required
          type="password"
          placeholder="Password"
          errors={state?.errors ?? []}
          name="password"
        />
        <FormButton text="Log in" />
      </form>
      <SocialLogin />
    </div>
  );
}
