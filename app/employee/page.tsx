import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Topbar from "@/components/Topbar/Topbar";
import { faker } from "@faker-js/faker";

// Generate fake employee data
const employees = Array.from({ length: 10 }, () => ({
  id: faker.datatype.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
}));

const EmployeeTable = () => {
  return (
    <div className="container mx-auto p-4">
      <Card className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 sm:px-6 sm:py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avatar
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:table-cell hidden">
                Last Name
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:table-cell hidden">
                Email
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap border-b border-gray-200">
                  <Avatar>
                    <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                    <AvatarFallback>{employee.firstName.charAt(0)}{employee.lastName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap border-b border-gray-200">{employee.firstName}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap border-b border-gray-200 sm:table-cell hidden">{employee.lastName}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap border-b border-gray-200 sm:table-cell hidden">{employee.email}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap border-b border-gray-200">
                  <Button variant="outline">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const Page = () => {
  return (
    <div className="sm:h-screen">
      <Topbar />
      <div className="flex items-center justify-center mt-4">
        <EmployeeTable />
      </div>
    </div>
  );
};

export default Page;
