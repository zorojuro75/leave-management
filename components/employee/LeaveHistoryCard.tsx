import React from "react";

type Props = {
  index: number;
  leave: any;
};

const LeaveHistoryCard = ({ index, leave }: Props) => {
  return (
    <div key={index} className="mx-5 py-2 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>{leave.leave_type}</div>
        <div className="text-xs border rounded-xl py-1 px-2">
          {leave.isRejected
            ? "Rejected"
            : leave.hr_approval
            ? "Approved"
            : "Pendding"}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>{leave.start_date}</div>
        <div className="border-b border-black border-dotted flex-1 mx-5"></div>
        <div>{leave.end_date}</div>
      </div>
      <div></div>
    </div>
  );
};

export default LeaveHistoryCard;
