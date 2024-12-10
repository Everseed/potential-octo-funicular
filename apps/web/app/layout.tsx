import { MainNav } from '@/components/main-nav';

import { Inter } from "next/font/google"
import "@/styles/globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased`}>
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="font-bold text-xl">
              PrepAI
            </Link>
            <MainNav />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}