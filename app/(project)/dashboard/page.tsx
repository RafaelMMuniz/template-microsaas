import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if(!session){
    redirect("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Dashboard Page</h1>
      <p className="mt-4 text-lg">{session?.user?.email ? session?.user?.email : " "}</p>
      {
        session?.user?.email && (
          <form action={handleAuth} className="">
                  <button type="submit" className="cursor-pointer border rounded-md px-2">Logout</button>
          </form>
        )
      }

      <Link href="/pagamentos" className="mt-4 border rounded-md px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 transition duration-200">
        Pagamentos
      </Link>
    </div>
  );
}