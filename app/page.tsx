"use client";
import React, { useEffect, useState } from "react";
import Form from "@/components/employee/Form";
import Topbar from "@/components/Topbar/Topbar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabaseClient";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

    fetchData();
  }, [session, router, status]);
  const handleButtonClick = async () => {
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
      setIsDialogOpen(true); // Open the dialog
    } else {
      console.error("No session found.");
    }
  };

  return (
    <div className="flex flex-col gap-5 items-center">
      <Topbar />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleButtonClick}>Tap to see Leave Balance</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Balance</DialogTitle>
            <DialogDescription>
              {leaveBalance ? (
                leaveBalance.map((leave) => (
                  <div key={leave.id}>
                    <p>Type: {leave.leave_type}</p>
                    <p>Remaining Days: {leave.remaining_days}</p>
                  </div>
                ))
              ) : (
                <p>No leave balance data available.</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <Form />
    </div>
  );
}
