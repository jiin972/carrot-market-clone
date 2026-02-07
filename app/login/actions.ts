"use server";
import { redirect } from "next/navigation";

interface IFormState {
  errors: string[];
}

export const handleForm = async (
  prevState: IFormState | null,
  data: FormData,
) => {
  console.log(prevState);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  redirect("/");
  return {
    errors: ["wrong password", "password too short"],
  };
};
