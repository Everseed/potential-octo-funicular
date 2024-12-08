"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  Settings
} from "lucide-react"

const routes = [
  {
    label: "Vue d'ensemble",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Mes Cours",
    icon: BookOpen,
    href: "/dashboard/courses",
  },
  {
    label: "Certifications",
    icon: GraduationCap,
    href: "/dashboard/certifications",
  },
  {
    label: "Mentors",
    icon: Users,
    href: "/dashboard/mentors",
  },
  {
    label: "Paramètres",
    icon: Settings,
    href: "/dashboard/settings",
  }
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={pathname === route.href ? "default" : "ghost"}
          className={cn(
            "w-full justify-start",
            pathname === route.href && "bg-blue-100 text-blue-700 hover:bg-blue-200"
          )}
          asChild
        >
          <Link href={route.href}>
            <route.icon className="mr-2 h-4 w-4" />
            {route.label}
          </Link>
        </Button>
      ))}
    </nav>
  )
}