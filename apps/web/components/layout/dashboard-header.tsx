import { MainNav } from "@/components/layout/main-nav"
import { Search } from "@/components/layout/search"

interface DashboardHeaderProps {
  children?: React.ReactNode
}

export function DashboardHeader({ children }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="container flex h-16 items-center justify-between py-4">
        <MainNav />
        <div className="flex items-center gap-4">
          <Search />
          {children}
        </div>
      </div>
    </header>
  )
}