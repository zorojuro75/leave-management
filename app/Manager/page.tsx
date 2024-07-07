"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useSession } from "next-auth/react";

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

const ManagerPage: React.FC = () => {
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
      } else if (role === "HR") {
        router.push("/hr");
      }
    };

    fetchData();
  }, [session, router, status]);

  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from("leave_applications")
        .select("*")
        .eq("manager_approval", false);

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

  const handleApprove = async (id: number) => {
    const { error } = await supabase
      .from("leave_applications")
      .update({ manager_approval: true })
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
      const { data: HR, error: HRError } = await supabase
        .from("users")
        .select("first_name, email")
        .eq("role", "HR")
        .limit(1);
  
      if (HRError || !HR || HR.length === 0) {
        console.error(
          "Error fetching HR:",
          HRError || "No HR found"
        );
        return;
      }
      const receiver = {
        name: HR[0].first_name,
        address: HR[0].email,
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
      toast.success("Leave application approved successfully!");
    }
  };

  return (
    <div>
      <Topbar />
      <ToastContainer />
      <div className="p-5">
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
              <Table className="max-w-7xl mx-auto w-fit border p-4 rounded shadow">
                <TableHeader>
                  <TableRow>
                    <TableHead className="sm:w-[200px]">Employee</TableHead>
                    <TableHead className="sm:w-[200px]">Name</TableHead>
                    <TableHead className="sm:w-[200px]">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="sm:w-[200px]">
                        {application.name}
                      </TableCell>
                      <TableCell className="sm:w-[200px]">
                        <img src={application.image_url} alt="" className="sm:w-16 sm:h-16 w-12 h-12 rounded-full" />
                        
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger
                            onClick={() => setSelectedApplication(application)}
                          >
                            <div className="border rounded px-3 py-2 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">View</div>
                          </DialogTrigger>
                          <DialogContent>
                            <Details
                              application={selectedApplication}
                              onApprove={handleApprove}
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

export default ManagerPage;
