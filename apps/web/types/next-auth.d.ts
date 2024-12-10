// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
    accessToken: string;
    error?: "RefreshAccessTokenError";
  }

  interface User {
    role: UserRole;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    accessToken: string;
    refreshToken: string;
    error?: "RefreshAccessTokenError";
  }
}