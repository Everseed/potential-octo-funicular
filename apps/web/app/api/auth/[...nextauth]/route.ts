import NextAuth, { NextAuthConfig, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import {mockUsers} from "@/app/(auth)/mock-users";

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
          throw new Error("Email et mot de passe requis");
        }

        const user = mockUsers.find(
            (user) =>
                user.email === credentials.email &&
                user.password === credentials.password
        );

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Erreur d'authentification");
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error: any) {
          throw new Error(error.message || "Erreur de connexion");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Mise à jour du token lors de la connexion initiale
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      // Gérer le rafraîchissement du token
      if (isTokenExpired(token)) {
        return refreshToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      // Ajouter les informations supplémentaires à la session
      if (token) {
        // @ts-expect-error user is null
        session.user.id = token.sub;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Pour les connexions sociales
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              provider: account.provider,
            }),
          });

          if (!response.ok) return false;

          const data = await response.json();
          user.accessToken = data.accessToken;
          user.refreshToken = data.refreshToken;
        } catch {
          return false;
        }
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Fonctions utilitaires
function isTokenExpired(token: JWT): boolean {
  const expiryTime = (token.exp || 0) * 1000;
  const currentTime = Date.now();
  // Rafraîchir si moins de 5 minutes restantes
  return currentTime >= expiryTime - 5 * 60 * 1000;
}

async function refreshToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      exp: getExpiryTime(data.accessToken),
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

function getExpiryTime(token: string): number {
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  return decodedToken.exp;
}