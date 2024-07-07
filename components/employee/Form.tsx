"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "../../utils/supabaseClient";
import { useSession } from "next-auth/react";

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

type FormData = {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  reason: string;
  leaveType: string;
  dateRange: { startDate: string; endDate: string };
  contactInfo: string;
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
      contact_info: data.contactInfo,
      manager_approval: false,
      hr_approval: false,
      email: session?.user.email,
      image_url : session?.user.image_url,
      isRejected: false,
    });

    if (error) {
      console.error(error);
      return;
    }
    const sender = {
      name: data.name,
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
    <div className="flex items-center justify-center sm:p-5 sm:w-[500px] w-[320px]">
      <ToastContainer />
      <Card className="w-full max-w-lg mx-auto rounded-none sm:rounded">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Leave Application Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                {...register("name", { required: true })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                type="text"
                id="employeeId"
                {...register("employeeId", { required: true })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="department">Unit/Department</Label>
              <Input
                type="text"
                id="department"
                {...register("department", { required: true })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="position">Position</Label>
              <Input
                type="text"
                id="position"
                {...register("position", { required: true })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reason">Reason for Leaving</Label>
              <Input
                type="text"
                id="reason"
                {...register("reason", { required: true })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select onValueChange={handleLeaveTypeChange} defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Select a leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((leaveType, index) => (
                    <SelectItem value={leaveType} key={index}>
                      {leaveType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
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
              <Label htmlFor="endDate">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="contactInfo">Contact Information</Label>
              <Input
                type="text"
                id="contactInfo"
                {...register("contactInfo", { required: true })}
              />
            </div>
            <CardFooter>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Form;
