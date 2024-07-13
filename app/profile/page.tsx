"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";
import bcrypt from "bcryptjs";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Topbar from "@/components/Topbar/Topbar";

const ProfileEdit = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    image_url: "",
    role: "",
  });
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchUserProfile(session.user?.id!);
    }
  }, [session]);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("email, username, first_name, last_name, image_url, role")
      .eq("id", userId)
      .single();

    if (error) {
      setError(error.message);
    } else {
      setProfile(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!session) {
      setError("Not authenticated");
      return;
    }

    const userId = session.user?.id;

    let updateFields: {
      email?: string;
      username?: string;
      first_name?: string;
      last_name?: string;
      image_url?: string;
      password?: string;
    } = {
      email: profile.email,
      username: profile.username,
      first_name: profile.first_name,
      last_name: profile.last_name,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    if (imageFile) {
      // Upload new image file to Supabase storage

      const { data: fileData, error: fileError } = await supabase.storage
        .from("images")
        .upload(`${profile.username}-${Date.now()}`, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (fileError) {
        setError("Error uploading image.");
        console.error("Error uploading image:", fileError);
        return;
      }

      // Get the new uploaded image URL
      updateFields.image_url = `https://mlhdxazwwufrwberxmid.supabase.co/storage/v1/object/public/images/${fileData.path}`;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update(updateFields)
      .eq("id", userId);

    if (updateError) {
      setError(updateError.message);
    } else {
      router.push("/profile");
    }
  };

  return (
    <div className="sm:h-screen">
      <Topbar />
      <div className="flex items-center justify-center">
        <div className="p-4 flex flex-col items-center w-full max-w-7xl">
          <h1 className="text-2xl mb-4">Edit Profile</h1>
          <form
            onSubmit={handleSubmit}
            className="w-full grid sm:grid-cols-3 gap-5"
          >
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="sm:col-span-2 grid sm:grid-cols-2 gap-5">
              <div className="mb-4">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={profile.username}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </Label>
                <Input
                  id="first_name"
                  type="text"
                  value={profile.first_name}
                  onChange={(e) =>
                    setProfile({ ...profile, first_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  type="text"
                  value={profile.last_name}
                  onChange={(e) =>
                    setProfile({ ...profile, last_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </Label>
                <Input
                  id="role"
                  type="text"
                  value={profile.role}
                  onChange={(e) =>
                    setProfile({ ...profile, role: e.target.value })
                  }
                  disabled
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </div>
            </div>
            <div className="mb-4 flex flex-col items-center justify-center">
              <Avatar className="w-40 h-40 mb-2">
                <AvatarImage src={profile.image_url} alt={profile.username} />
                <AvatarFallback>{profile.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="mb-4">
                <Input
                  id="image"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImageFile(file);
                  }}
                />
              </div>
            </div>
            <div className="sm:col-span-3">
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
