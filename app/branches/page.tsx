import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Topbar from "@/components/Topbar/Topbar";
import { faker } from "@faker-js/faker";


// Generate fake branch data
const branches = Array.from({ length: 10 }, () => ({
  id: faker.datatype.uuid(),
  location: faker.address.city(),
  manager: faker.name.firstName(),
  numberOfEmployees: faker.datatype.number({ min: 10, max: 100 }),
}));


const BranchTable = () => {
  return (
    <div className="container mx-auto p-4">
      <Card className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 sm:px-6 sm:py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Manager
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Number of Employees
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.id}>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap border-b border-gray-200">{branch.location}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap border-b border-gray-200 hidden sm:table-cell">{branch.manager}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap border-b border-gray-200 hidden sm:table-cell">{branch.numberOfEmployees}</td>
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
      <div className="flex flex-col items-center justify-center mt-4 space-y-4">
        <BranchTable />
      </div>
    </div>
  );
};

export default Page;
