import React from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Topbar = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleHomeClick = () => {
    if (session?.user?.role === "HR") {
      router.push("/hr");
    } else if (session?.user?.role === "Manager") {
      router.push("/Manager");
    } else {
      router.push("/");
    }
  };
  const handleLogoutClick = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="z-50 sticky top-0 bg-[#FBFDFD] w-full shadow-sm border-b">
      <div className="h-[70px] flex justify-between items-center px-10 max-w-[100rem] mx-auto">
        <div onClick={handleHomeClick} className="h-[50px] w-[50px] rounded-full overflow-hidden">
        <img src="images/logo.jpg" alt="" className="h-[50px]" />
        </div>
        <div className="flex gap-5 items-center">
          <Link href={'/'} className="hover:bg-slate-100 px-2 py-1">Dashboard</Link>
          <Link href={'/profile'} className="hover:bg-slate-100 px-2 py-1">
            Profile
          </Link>
          <Link href={'/'} className="hover:bg-slate-100 px-2 py-1">
            Employee
          </Link>
          <Link href={'/'} className="hover:bg-slate-100 px-2 py-1">
            Company
          </Link>
          <Button onClick={handleLogoutClick}>Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
