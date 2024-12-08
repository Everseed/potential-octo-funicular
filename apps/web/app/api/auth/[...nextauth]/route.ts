// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { mockUsers } from "./mock-users";

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        console.log(credentials);
        try {
          if (process.env.NODE_ENV === "development") {
            const user = mockUsers.find(user => 
              user.email === credentials.email && 
              user.password === credentials.password
            );

            if (!user) {
              return null;
            }

            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }

          // En production
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });

          const user = await response.json();

          if (!response.ok) {
            return null;
          }

          return user;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          createdAt: token.createdAt,
          updatedAt: token.updatedAt,
        },
      };
    }
  },
  session: { strategy: "jwt" },
  trustHost: true,
  debug: true,
  logger: {
    error(code, ...message) {
      console.error(code, message)
    },
    warn(code, ...message) {
      console.warn(code, message)
    },
    debug(code, ...message) {
      console.debug(code, message)
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };