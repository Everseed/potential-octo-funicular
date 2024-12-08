'use client'

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar,
  Settings,
  Menu,
  X,
  Bell,
  Search 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Tableau de bord",
    href: "/dashboard",
  },
  {
    icon: BookOpen,
    label: "Cours",
    href: "/courses",
  },
  {
    icon: Users,
    label: "Mentors",
    href: "/mentors",
  },
  {
    icon: Calendar,
    label: "Calendrier",
    href: "/schedule",
  },
  {
    icon: Settings,
    label: "Paramètres",
    href: "/settings",
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg lg:hidden hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <span className="text-xl font-semibold">PrepAI</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              {isSearchOpen ? (
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="w-full lg:w-[300px]"
                    autoFocus
                  />
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}

              {/* Notifications */}
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>

              {/* User Menu */}
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar & Content */}
      <div className="pt-14 flex overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <aside className={`
          fixed top-14 left-0 z-40 w-64 h-screen 
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                    >
                      <Icon className="w-5 h-5 text-gray-500" />
                      <span className="ml-3">{item.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="relative flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto bg-gray-50 lg:ml-0">
          {children}
        </main>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  )
}