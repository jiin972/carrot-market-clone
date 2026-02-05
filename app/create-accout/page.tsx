import SocialLogin from "@/components/social-login";

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6 ">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the Form below to join!</h2>
      </div>
      <form className="flex flex-col gap-3 ">
        <div className="flex flex-col  gap-2">
          <input
            className="bg-transparent rounded-md w-full h-10 focus:outline-none 
            ring-1 focus:ring-2 ring-neutral-200 focus:ring-orange-500 
            border-none placeholder:text-neutral-500 peer
            "
            type="text"
            placeholder="Username"
            required
          />
          <span className="text-red-400 peer-">Input error</span>
        </div>
        <div>
          <button className="btn-primary h-10">Create account</button>
        </div>
      </form>
      <SocialLogin />
    </div>
  );
}
