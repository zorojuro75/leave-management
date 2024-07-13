"use client";
import React, { useEffect, useState } from "react";
import Form from "@/components/employee/Form";
import Topbar from "@/components/Topbar/Topbar";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import LeaveCard from "@/components/employee/LeaveCard";
import LeaveHistory from "@/components/employee/LeaveHistory";

type LeaveBalance = {
  id: number;
  user_email: string;
  leave_type: string;
  remaining_days: number;
  created_at: string;
  updated_at: string;
};

export default function Home() {
  const { data: session } = useSession();
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[] | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      console.log(session);

      if (!session) {
        return;
      }

      const role = session.user.role;

      if (role === "HR") {
        router.push("/hr");
      } else if (role === "Manager") {
        router.push("/Manager");
      }
    };

    const fetchLeave = async () => {
      if (session && session.user && session.user.email) {
        const email = session.user.email;
        const { data, error } = await supabase
          .from("leave_balance")
          .select("*")
          .eq("user_email", email);

        if (error) {
          console.error("Error fetching leave balance:", error);
          return;
        }

        setLeaveBalance(data);
      } else {
        console.error("No session found.");
      }
    };
    fetchData();
    fetchLeave();
  }, [session, router]);

  return (
    <div>
      <Topbar />
      <div className="max-w-[100rem] xl:mx-auto mx-10 flex flex-col gap-10 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-5 flex-1">
          {leaveBalance &&
            leaveBalance.map((leave) => (
              <LeaveCard
                key={leave.id}
                leaveType={leave.leave_type}
                remainingDays={leave.remaining_days}
                className="flex gap-5 items-center bg-[#f2faf9]"
              />
            ))}
        </div>
        <div className="flex gap-10">
          <Form />
          <div className="flex-1 hidden md:block">
            <LeaveHistory email={session?.user.email!}/>
          </div>
        </div>
      </div>
    </div>
  );
}
