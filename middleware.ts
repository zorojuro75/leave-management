// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
    newUser: "/signin"
  },
});

export const config = {
  matcher: [
    "/",
    "/Manager",
    "/hr",
    "/profile"
  ],
};
