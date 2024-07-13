"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "../../utils/supabaseClient";
import { useSession } from "next-auth/react";
import { FaWpforms } from "react-icons/fa6";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiCalendarDate } from "react-icons/ci";
import { TbBrandReason } from "react-icons/tb";
import { LuFileType } from "react-icons/lu";
import { MdOutlinePermIdentity } from "react-icons/md";
import { IoKeypadOutline } from "react-icons/io5";
import { FaRankingStar } from "react-icons/fa6";
import { BsBuildingCheck } from "react-icons/bs";

type FormData = {
  name: string;
  employeeId: number;
  department: string;
  position: string;
  reason: string;
  leaveType: string;
  dateRange: { startDate: string; endDate: string };
};
const leaveTypes = [
  "Annual leave",
  "Substitute leave",
  "Sick leave",
  "Without pay leave",
  "Casual Leave",
  "Maternity Leave",
];

const Form: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const { data: session } = useSession();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!startDate || !endDate) {
      console.error("Date range is not selected.");
      return;
    }

    const startDateString = startDate.toISOString();
    const endDateString = endDate.toISOString();

    const { error } = await supabase.from("leave_applications").insert({
      name: data.name,
      employee_id: data.employeeId,
      department: data.department,
      position: data.position,
      reason: data.reason,
      leave_type: data.leaveType,
      start_date: startDateString,
      end_date: endDateString,
      manager_approval: false,
      hr_approval: false,
      email: session?.user.email,
      image_url: session?.user.image_url,
      isRejected: false,
    });

    if (error) {
      console.error(error);
      return;
    }
    const sender = {
      name: session?.user.name,
      address: session?.user?.email ?? "",
    };
    const { data: managers, error: managerError } = await supabase
      .from("users")
      .select("first_name, email")
      .eq("role", "Manager")
      .limit(1);

    if (managerError || !managers || managers.length === 0) {
      console.error(
        "Error fetching manager:",
        managerError || "No manager found"
      );
      return;
    }
    const receiver = {
      name: managers[0].first_name,
      address: managers[0].email,
    };
    fetch("/api/sendMail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender,
        receiver,
        subject: "Leave Application Submitted",
        message: `You have a new leave application request. Please review the application.`,
      }),
    }).then((response) => response.json());
    toast.success("Leave application submitted successfully!");
  };

  const handleLeaveTypeChange = (value: string) => {
    setValue("leaveType", value);
  };

  return (
    <div className="sm:w-[70%] w-full flex h-fit">
      <ToastContainer />
      <Card className="w-full rounded-lg bg-blue-50">
        <h1 className="px-[24px] py-5 text-[18px] sm:text-[24px] flex gap-2 items-center">
          <FaWpforms />
          Leave Application Form
        </h1>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex gap-10">
              <div className="flex-1 grid sm:grid-cols-2 gap-5 col-span-2 sm:col-span-1">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="flex gap-2 items-center">
                    <MdOutlinePermIdentity size={18} />
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    className="bg-blue-100"
                    {...register("name", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="employeeId"
                    className="flex gap-2 items-center"
                  >
                    <IoKeypadOutline size={18} />
                    Employee ID
                  </Label>
                  <Input
                    type="text"
                    id="employeeId"
                    className="bg-blue-100"
                    {...register("employeeId", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="department"
                    className="flex gap-2 items-center"
                  >
                    <BsBuildingCheck size={18} />
                    Department
                  </Label>
                  <Input
                    type="text"
                    id="department"
                    className="bg-blue-100"
                    {...register("department", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="position" className="flex gap-2 items-center">
                    <FaRankingStar size={18} />
                    Position
                  </Label>
                  <Input
                    type="text"
                    id="position"
                    className="bg-blue-100"
                    {...register("position", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reason" className="flex gap-2 items-center">
                    <TbBrandReason size={18} />
                    Reason for Leaving
                  </Label>
                  <Input
                    type="text"
                    id="reason"
                    className="bg-blue-100"
                    {...register("reason", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="leaveType"
                    className="flex gap-2 items-center"
                  >
                    <LuFileType size={18} />
                    Leave Type
                  </Label>
                  <Select onValueChange={handleLeaveTypeChange} defaultValue="">
                    <SelectTrigger className="bg-blue-100">
                      <SelectValue placeholder="Select a leave type" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-100">
                      {leaveTypes.map((leaveType, index) => (
                        <SelectItem value={leaveType} key={index}>
                          {leaveType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="startDate"
                    className="flex gap-2 items-center"
                  >
                    <CiCalendarDate size={18} />
                    Start Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild className="bg-blue-100">
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Pick start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="endDate" className="flex gap-2 items-center">
                    <CiCalendarDate size={18} />
                    End Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild className="bg-blue-100">
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Pick end date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="sm:flex h-min hidden">
                <Calendar
                  mode="range"
                  selected={{ from: startDate, to: endDate }}
                  className="bg-blue-200 rounded-lg sm:block hidden p-5"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className=" bg-blue-300 hover:bg-[blue-300 hover:shadow-lg hover:shadow-blue-200"
              >
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Form;
