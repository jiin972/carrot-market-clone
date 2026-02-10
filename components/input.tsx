import { InputHTMLAttributes } from "react";

interface InputProps {
  errors?: string[];
  name: string;
}

export default function Input({
  errors = [],
  name,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  console.log(rest);
  return (
    <div className="flex flex-col  gap-2">
      <input
        name={name}
        className={`bg-transparent rounded-md w-full h-10 focus:outline-none 
            ring-1 focus:ring-3 ring-neutral-200 transition focus:ring-orange-500 
            border-none placeholder:text-neutral-500`}
        {...rest}
      />
      {errors?.map((error, index) => (
        <span key={index} className="text-orange-500 ">
          {error}
        </span>
      ))}
    </div>
  );
}
