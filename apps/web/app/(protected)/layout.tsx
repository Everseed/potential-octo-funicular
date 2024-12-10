import type { Metadata } from "next"
import { Inter } from "next/font/google"
/* import "@/styles/globals.css" */
import "@/styles/globals.css";
import { AuthProvider } from "../providers";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";



const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PrepAI - Plateforme d'apprentissage",
  description: "Préparez-vous aux entretiens et certifications avec des experts",

  icons: {
    icon: "/favicon.ico",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

/* const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/auth/signin');
        },
    });

    if (status === "loading") {
        return <div>Loading...</div>;
    } */

  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased`}>
       <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}