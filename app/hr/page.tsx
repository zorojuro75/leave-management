"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { supabase } from "../../utils/supabaseClient";
import Details from "@/components/manager/Details";
import Topbar from "@/components/Topbar/Topbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type LeaveApplication = {
  id: number;
  name: string;
  employee_id: string;
  department: string;
  position: string;
  reason: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  contact_info: string;
  approved: boolean;
  email: string;
  image_url: string;
};

const HRPage: React.FC = () => {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<LeaveApplication | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        return;
      }

      const role = session.user.role;

      if (role === "Employee") {
        router.push("/");
      } else if (role === "Manager") {
        router.push("/Manager");
      }
    };

    fetchData();
  }, [session, router, status]);

  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from("leave_applications")
        .select("*")
        .eq("manager_approval", true)
        .eq("hr_approval", false);

      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        setApplications(data as LeaveApplication[]);
      }
      setLoading(false);
    };

    fetchApplications();
  }, []);

  const closeDialog = () => {
    setSelectedApplication(null);
  };

  const handleReject = async (id: number) => {
    const { error } = await supabase
      .from("leave_applications")
      .update({ isRejected: true })
      .eq("id", id);

    if (error) {
      console.error("Error updating application:", error);
    } else {
      setApplications(applications.filter((app) => app.id !== id));
      closeDialog();
      const sender = {
        name: session?.user?.name,
        address: session?.user?.email ?? "",
      };
      const { data: applicationData, error: applicationError } = await supabase
        .from("leave_applications")
        .select("*")
        .eq("id", id)
        .single();

      if (applicationError || !applicationData) {
        console.error(
          "Error fetching application data:",
          applicationError || "No data found"
        );
        return;
      }
      const receiver = {
        name: applicationData.name,
        address: applicationData.email,
      };
      fetch("/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender,
          receiver,
          subject: "Leave Application Info",
          message: `your application has been rejected.`,
        }),
      }).then((response) => response.json());
      toast.success("Leave application rejected successfully!");
    }
  };
  const handleApprove = async (id: number) => {
    const { error } = await supabase
      .from("leave_applications")
      .update({ hr_approval: true })
      .eq("id", id);

    if (error) {
      console.error("Error updating application:", error);
    } else {
      // Deduct leave days from leave_balance table
      const { data: applicationData, error: applicationError } = await supabase
        .from("leave_applications")
        .select("*")
        .eq("id", id)
        .single();

      if (applicationError || !applicationData) {
        console.error(
          "Error fetching application data:",
          applicationError || "No data found"
        );
        return;
      }

      const {
        leave_type,
        email: employee_email,
        start_date,
        end_date,
      } = applicationData;

      const { data: leave, error } = await supabase
        .from("leave_balance")
        .select("remaining_days")
        .eq("user_email", employee_email)
        .eq("leave_type", leave_type)
        .single();

      // Calculate number of leave days approved
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      const numberOfDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );

      // Update leave balance for the employee
      const { error: balanceError } = await supabase
        .from("leave_balance")
        .update({ remaining_days: leave?.remaining_days - numberOfDays })
        .eq("user_email", employee_email)
        .eq("leave_type", leave_type);

      if (balanceError) {
        console.error("Error updating leave balance:", balanceError);
      }

      // Update local state to remove the approved application from the list
      setApplications(applications.filter((app) => app.id !== id));
      closeDialog();

      // Send email notification to employee
      const sender = {
        name: session?.user?.name,
        address: session?.user?.email ?? "",
      };
      const receiver = {
        name: applicationData.name,
        address: applicationData.email,
      };
      fetch("/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender,
          receiver,
          subject: "Leave Application Approved",
          message: `Your leave application has been approved by ${session?.user.name}.`,
        }),
      }).then((response) => response.json());

      // Show success toast
      toast.success("Leave application approved successfully!");
    }
  };

  return (
    <div>
      <Topbar />
      <ToastContainer />
      <div className="max-w-[100rem] xl:mx-auto mx-10 flex flex-col gap-10 py-5">
        <h1 className="text-xl font-semibold text-center py-2">
          Leave Application List
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {applications.length === 0 ? (
              <p>No pending applications.</p>
            ) : (
              <Table className="border p-2 rounded flex flex-col">
                <TableHeader className="flex">
                  <TableRow className="flex flex-1 justify-between items-center">
                    <TableHead className="w-[100px]  text-wrap">Name</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="flex">
                  {applications.map((application) => (
                    <TableRow
                      key={application.id}
                      className="flex flex-1 justify-between items-center"
                    >
                      <TableCell className="w-[100px] text-wrap">
                        {application.name}
                      </TableCell>
                      <TableCell>
                        <img
                          src={application.image_url}
                          alt="image"
                          className="sm:w-16 sm:h-16 w-12 h-12 rounded-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger
                            onClick={() => setSelectedApplication(application)}
                          >
                            <div className="border rounded px-3 py-2 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
                              View
                            </div>
                          </DialogTrigger>
                          <DialogContent className="mx-5">
                            <Details
                              application={selectedApplication}
                              onApprove={handleApprove}
                              onReject={handleReject}
                              onClose={closeDialog}
                            />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRPage;
