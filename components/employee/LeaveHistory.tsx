"use client";
import React, { useEffect, useState } from "react";
import { MdHistory } from "react-icons/md";
import { supabase } from "../../utils/supabaseClient";
import LeaveHistoryCard from "./LeaveHistoryCard";

type Props = {
  email: string;
};

const LeaveHistory = ({ email }: Props) => {
  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      const { data, error } = await supabase
        .from("leave_applications")
        .select("leave_type, start_date, end_date, hr_approval, isRejected")
        .eq("email", email);

      if (error) {
        console.error("Error fetching leave history:", error);
      } else {
        setLeaveHistory(data);
      }
      setLoading(false);
    };

    fetchLeaveHistory();
  });

  return (
    <div className="border rounded-lg px-5 pb-5 bg-[#ecb176] bg-opacity-5">
      <h1 className="px-[24px] py-5 text-[18px] sm:text-[24px] flex gap-2 items-center">
        <MdHistory />
        Leave History
      </h1>
      <hr className="" />
      {loading ? (
        <p>Loading...</p>
      ) : leaveHistory.length > 0 ? (
        <>
          {leaveHistory.map((leave, index) => (
            <>
            <LeaveHistoryCard index={index} leave={leave}/>
            <hr className="" />
            </>
          ))}
        </>
      ) : (
        <p>No leave history found.</p>
      )}
    </div>
  );
};

export default LeaveHistory;
