import { handleAuth } from "@/app/actions/handle-auth";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-10">Login Page</h1>

      <form action={handleAuth} className="">
        <button type="submit" className="cursor-pointer border rounded-md px-2">Signin with Google</button>
      </form>
    </div>
  );
}