// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { User as PrismaUser, UserRole } from "@prisma/client";

// Étend le type User de next-auth avec notre modèle Prisma
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
      clerkId: string;
      createdAt: Date;
      updatedAt: Date;
    } & DefaultSession["user"]
  }

  // Utilise notre modèle Prisma comme base pour le type User
  interface User extends PrismaUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
    clerkId: string;
    createdAt: Date;
    updatedAt: Date;
  }
}