import FormButton from "@/components/form-button";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { resolve } from "styled-jsx/css";

export default function Login() {
  const handleForm = async (data: FormData) => {
    "use server";
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(data.get("email"), data.get("password"));
    console.log("server action!");
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6 ">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={handleForm} className="flex flex-col gap-2 ">
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
          errors={[]}
          name="password"
        />
        <FormButton text="Log in" />
      </form>
      <SocialLogin />
    </div>
  );
}
