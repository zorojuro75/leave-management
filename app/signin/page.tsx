"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";
import bcrypt from "bcryptjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const leaveTypes = [
  "Annual leave",
  "Substitute leave",
  "Sick leave",
  "Without pay leave",
  "Casual Leave",
  "Maternity Leave",
];

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null); // State to hold the selected image file
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check if image file is selected
    if (!imageFile) {
      setError("Please upload an image.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload image file to Supabase storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from("images")
      .upload(`${username}`, imageFile);

    if (fileError) {
      setError("Error uploading image.");
      console.error("Error uploading image:", fileError);
      return;
    }

    // Get the uploaded image URL
    const imageUrl = `https://mlhdxazwwufrwberxmid.supabase.co/storage/v1/object/public/images/${fileData.path}`;

    // Insert user data into Supabase database
    const { data: userData, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email,
          username,
          password: hashedPassword,
          role,
          first_name: firstName,
          last_name: lastName,
          image_url: imageUrl,
        },
      ])
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    // Create leave balance for new employees
    if (role === "Employee") {
      const leaveBalanceInserts = leaveTypes.map((leaveType) => ({
        user_email: email,
        leave_type: leaveType,
        remaining_days: 10, // Default remaining days
      }));

      const { error: leaveBalanceError } = await supabase
        .from("leave_balance")
        .insert(leaveBalanceInserts);

      if (leaveBalanceError) {
        setError(leaveBalanceError.message);
        return;
      }
    }

    router.push("/login");
  };

  return (
    <div className="sm:h-screen flex items-center justify-center p-5 bg-[url('/images/login.jpg')] bg-cover">
      <Card className="sm:w-[800px] w-[320px] mx-auto p-4 flex flex-col items-center backdrop-blur-sm bg-black bg-opacity-40 text-white border-none shadow-2xl">
        <h1 className="text-2xl mb-4">Create new account</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full grid sm:grid-cols-2 grid-cols-1 gap-5"
        >
          {error && <p className="text-red-500 sm:col-span-2 col-span-1">{error}</p>}
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-white"
            >
              First Name
            </label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              className="bg-transparent"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-white"
            >
              Last Name
            </label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              className="bg-transparent"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              className="bg-transparent"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-white"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              className="bg-transparent"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              className="bg-transparent"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-white"
            >
              Image Upload
            </label>
            <Input
              id="image"
              type="file"
              className="bg-transparent"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-white"
            >
              Role
            </label>
            <Select onValueChange={setRole}>
              <SelectTrigger className="bg-transparent">
                <SelectValue className=" text-black" placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="sm:col-span-2 sm:w-[100px] bg-[#00a990] hover:bg-[#007564]">
            Signup
          </Button>
        </form>
        <Separator className="my-4" />
        <div>
          Already have an Account?{" "}
          <Link href={"/login"} className="text-emerald-500">
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
