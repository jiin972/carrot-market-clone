import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Profile() {
  return (
    <Suspense fallback={"환영합니다. 잠시만 기다려 주세요."}>
      <ProfileContent />
    </Suspense>
  );
}

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

async function ProfileContent() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div>
      <h1>Welcom {user?.username}</h1>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
}

// async function getUser() {
//   const session = await getSession();
//   if (session.id) {
//     const user = await db.user.findUnique({
//       where: {
//         id: session.id,
//       },
//     });
//     if (user) {
//       return user;
//     }
//   }
//   notFound();
// }

// export default async function Profile() {
//   const user = await getUser();
//   const logOut = async () => {
//     "use server";
//     const session = await getSession();
//     await session.destroy();
//     redirect("/");
//   };
//   return (
//     <div>
//       <Suspense fallback={null}>
//         {" "}
//         <h1>Welcom {user?.username}</h1>
//         <form action={logOut}>
//           <button>Log out</button>
//         </form>
//       </Suspense>
//     </div>
//   );
