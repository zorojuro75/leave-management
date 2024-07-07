import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { supabase } from '../../../../utils/supabaseClient';
import bcrypt from 'bcryptjs';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter Your Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Your Password",
        },
        role: {
          label: "Role",
          type: "text",
          placeholder: "Select a role",
        },
      },
      async authorize(credentials) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', credentials?.username)
            .single();
      
          if (error || !data) {
            throw new Error("User not found");
          }
      
          const isValidPassword = await bcrypt.compare(credentials!.password, data.password);
      
          if (!isValidPassword) {
            throw new Error("Invalid password");
          }
      
          const user = {
            id: data.id,
            username: data.username,
            name: data.first_name,
            email: data.email,
            role: data.role,
            image_url: data.image_url,
          };
      
          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          return null; // Return null to indicate authorization failure
        }
      },
      
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.image_url = user.image_url;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email,
          role: token.role as string,
          name: token.name as string,
          image_url: token.image_url as string,
        };
      }
      return session;
    },
  },
  
  pages: {
    signIn: '/login',
    newUser: "/signin"
  }
};
