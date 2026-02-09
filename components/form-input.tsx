interface IFormInputProps {
  type: string;
  placeholder: string;
  required: boolean;
  errors?: string[];
  name: string;
}

export default function FormInput({
  type,
  placeholder,
  required,
  errors,
  name,
}: IFormInputProps) {
  return (
    <div className="flex flex-col  gap-2">
      <input
        className={`bg-transparent rounded-md w-full h-10 focus:outline-none 
            ring-1 focus:ring-3 ring-neutral-200 transition focus:ring-orange-500 
            border-none placeholder:text-neutral-500`}
        type={type}
        placeholder={placeholder}
        required={required}
        name={name}
      />
      {errors?.map((error, index) => (
        <span key={index} className="text-orange-500 ">
          {error}
        </span>
      ))}
    </div>
  );
}
