import React from "react";
import { IoCalendarNumber } from "react-icons/io5";
type Props = {
  leaveType: string;
  remainingDays: number;
  className?: string;
};

const LeaveCard = (props: Props) => {
  return (
    <div className={`p-5 rounded-lg ${props.className}`}>
      <IoCalendarNumber size={48} className="text-[#94DFD8]" />
      <div className="text-emerald-400 text-base">
        <div>{props.leaveType}</div>
        <div className="text-yellow-500 font-bold">{props.remainingDays}</div>
      </div>
    </div>
  );
};

export default LeaveCard;
