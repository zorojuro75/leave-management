"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { supabase } from "../../utils/supabaseClient";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("username", username)
        .single();

      if (userError) {
        setError(userError.message);
        return;
      }

      const userRole = userData.role;

      // Redirect based on role
      if (userRole === "HR") {
        router.push("/hr");
      } else if (userRole === "Manager") {
        router.push("/Manager");
      } else if (userRole === "Employee") {
        router.push("/");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-5">
      <Card className="sm:w-[400px] w-[320px] mx-auto p-4 flex flex-col items-center">
        <h1 className="text-xl mb-4 text-center">
          Wecome to Leave Management System
        </h1>
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col">
          {error && <p className="text-red-500">{error}</p>}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Login</Button>
        </form>
        <Separator className="my-4" />
        <div>
          Do not have an Account?{" "}
          <Link href={"/signin"} className="text-emerald-500">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
