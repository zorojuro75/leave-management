import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Profile from "./Profile";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="z-50 sticky top-0 bg-white w-full">
      <div className="h-[70px] border-b shadow-sm flex justify-between items-center px-10">
        <Button onClick={handleHomeClick}>Home</Button>
        <Profile />
      </div>
    </div>
  );
};

export default Topbar;
