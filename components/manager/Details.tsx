import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
};

type Props = {
  application: LeaveApplication | null;
  onApprove: (id: number) => void;
  onClose: () => void;
};

const Details: React.FC<Props> = ({ application, onApprove, onClose }) => {
  const handleApprove = async () => {
    if (application) {
      onApprove(application.id);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Leave Application Details</DialogTitle>
        <DialogDescription>
          {application && (
            <div className="mt-4">
              <p>
                <strong>Name:</strong> {application.name}
              </p>
              <p>
                <strong>Employee ID:</strong> {application.employee_id}
              </p>
              <p>
                <strong>Department:</strong> {application.department}
              </p>
              <p>
                <strong>Position:</strong> {application.position}
              </p>
              <p>
                <strong>Reason:</strong> {application.reason}
              </p>
              <p>
                <strong>Leave Type:</strong> {application.leave_type}
              </p>
              <p>
                <strong>From:</strong>{' '}
                {new Date(application.start_date).toLocaleDateString()}
              </p>
              <p>
                <strong>To:</strong>{' '}
                {new Date(application.end_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Contact Info:</strong> {application.contact_info}
              </p>
              <p>
                <strong>Email:</strong> {application.email}
              </p>
              <div className="flex gap-5 my-2">
                <Button className="border-0" onClick={handleApprove}>
                  Approve
                </Button>
                <Button className="bg-red-500 hover:bg-red-600 border-0">
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default Details;
