import { SidebarFilters } from "@/components/layout/sidebar-filters"

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 space-y-4 px-4 py-6">
      <div className="grid grid-cols-4 gap-6">
        <aside className="col-span-1">
          <SidebarFilters />
        </aside>
        <div className="col-span-3">
          {children}
        </div>
      </div>
    </div>
  )
}