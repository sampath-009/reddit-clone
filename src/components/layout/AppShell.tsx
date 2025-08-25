'use client'
import LeftNav from "@/components/nav/LeftNav"
import { useSidebar } from "@/components/nav/SidebarContext"
import clsx from "clsx"

export default function AppShell({ children, right }: {
  children: React.ReactNode
  right?: React.ReactNode
}) {
  const { collapsed } = useSidebar()
  const colsExpanded = 'xl:grid-cols-[260px_1fr_320px] lg:grid-cols-[260px_1fr]'
  const colsCollapsed = 'xl:grid-cols-[72px_1fr_320px]  lg:grid-cols-[72px_1fr]'

  return (
    <div className="mx-auto max-w-[1300px] px-3 lg:px-4">
      <div className={clsx('grid gap-4 lg:gap-6 grid-cols-1', collapsed ? colsCollapsed : colsExpanded)}>
        {/* LEFT: persistent, sticky, scrollable */}
        <aside className="hidden lg:block">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto pr-2">
            <LeftNav />
          </div>
        </aside>

        {/* CENTER FEED */}
        <main>{children}</main>

        {/* RIGHT RAIL (optional) */}
        <aside className="hidden xl:block">
          <div className="sticky top-16">{right}</div>
        </aside>
      </div>
    </div>
  )
}
