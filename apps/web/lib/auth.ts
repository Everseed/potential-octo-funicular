import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@prisma/client";

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getAuthSession();
  return session?.user;
}

// Middleware for protected routes
export function withAuth(roles: UserRole[] = []) {
  return async function authMiddleware(req: Request) {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    if (roles.length > 0 && !roles.includes(session.user.role)) {
      return new Response("Forbidden", { status: 403 });
    }
    
    return null; // Continue to route handler
  };
}