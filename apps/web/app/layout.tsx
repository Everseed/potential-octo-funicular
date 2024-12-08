import type { Metadata } from "next"
import { Inter } from "next/font/google"
/* import "@/styles/globals.css" */
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";


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
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}