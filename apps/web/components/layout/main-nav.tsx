import Link from "next/link"
import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-xl font-bold text-blue-600"
      >
        PrepAI
      </Link>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        Dashboard
      </Link>
      <Link
        href="/dashboard/courses"
        className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        Cours
      </Link>
      <Link
        href="/dashboard/mentors"
        className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        Mentors
      </Link>
      <Link
        href="/dashboard/certifications"
        className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        Certifications
      </Link>
      <Link
        href="/dashboard/exams"
        className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        Examens
      </Link>
    </nav>
  )
}