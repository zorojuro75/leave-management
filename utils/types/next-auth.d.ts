import NextAuth from "next-auth";
import { User } from 'next-auth';

declare module "next-auth" {
  interface Session {
    user: {
      role?: string | null;
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image_url?: string | null;
    };
  }
  interface User {
    role: string;
    image_url: string;
  }
  interface token{
    id: string;
    role: string;
    image_url: string;
  }
}