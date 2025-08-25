'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useSidebar } from "./SidebarContext"
import { Flame, Home, MessageSquare, Globe2, Gamepad2, Cpu, Film, Tv2, BookOpen, Image as ImageIcon, Music, Utensils } from "lucide-react"
import { sanityClient } from "@/lib/sanity"
import clsx from "clsx"

type Sub = { _id: string; name: string; displayName?: string; creator?: { clerkId?: string } }

const primary = [
  { href: "/", label: "Home", icon: Home },
  { href: "/popular", label: "Popular", icon: Flame },
  { href: "/all", label: "All", icon: MessageSquare },
]

const topics = [
  { href: "/t/internet-culture", label: "Internet Culture", icon: Globe2 },
  { href: "/t/games", label: "Games", icon: Gamepad2 },
  { href: "/t/technology", label: "Technology", icon: Cpu },
  { href: "/t/movies", label: "Movies", icon: Film },
  { href: "/t/television", label: "Television", icon: Tv2 },
  { href: "/t/books", label: "Books", icon: BookOpen },
  { href: "/t/pics", label: "Pics", icon: ImageIcon },
  { href: "/t/music", label: "Music", icon: Music },
  { href: "/t/food", label: "Food", icon: Utensils },
]

export default function LeftNav() {
  const { collapsed } = useSidebar()
  const pathname = usePathname()
  const { isLoaded, user } = useUser()
  const [mySubs, setMySubs] = useState<Sub[]>([])

  useEffect(() => {
    if (!isLoaded) return
    const clerkId = user?.id ?? ""
    
    // Fetch communities where user is creator or member
    const fetchCommunities = async () => {
      try {
        const query = `*[_type=="subreddit" && (creator->clerkId==$clerkId || $clerkId in members[]->clerkId)] | order(name asc)[0...25]{
          _id, name, displayName, description,
          creator->{clerkId}
        }`
        const rows = await sanityClient.fetch(query, { clerkId })
        setMySubs(rows || [])
      } catch (error) {
        console.error('Error fetching communities:', error)
        setMySubs([])
      }
    }
    
    fetchCommunities()
  }, [isLoaded, user?.id])

  return (
    <nav className={clsx('group/nav transition-[width] duration-200', collapsed ? 'w-[72px]' : 'w-[260px]')}>
      <Section title="Home" collapsed={collapsed}>
        {primary.map(i => (
          <NavLink 
            key={i.href} 
            href={i.href} 
            icon={<i.icon className="h-4 w-4" />} 
            label={i.label} 
            active={pathname === i.href} 
            collapsed={collapsed} 
          />
        ))}
      </Section>

      <Section title="Your communities" collapsed={collapsed}>
        {mySubs.length === 0 && !collapsed && (
          <div className="px-2 text-xs text-muted-foreground">Join or create a community.</div>
        )}
        {mySubs.slice(0, 20).map(s => (
          <div key={s._id} className="flex items-center justify-between">
            <NavLink 
              href={`/r/${s.name}`} 
              icon={<span className="h-4 w-4 rounded bg-muted inline-block" />} 
              label={`r/${s.name}`} 
              collapsed={collapsed} 
            />
            {s.creator?.clerkId === user?.id && !collapsed && (
              <span className="mr-1 rounded bg-muted px-2 py-0.5 text-[10px] text-xs">creator</span>
            )}
          </div>
        ))}
      </Section>

      <Section title="Topics" collapsed={collapsed}>
        {topics.map(t => (
          <NavLink 
            key={t.href} 
            href={t.href} 
            icon={<t.icon className="h-4 w-4" />} 
            label={t.label} 
            collapsed={collapsed} 
          />
        ))}
      </Section>

      <Section title="Resources" collapsed={collapsed}>
        <ExternalLink href="https://www.redditinc.com/" collapsed={collapsed}>About Reddit</ExternalLink>
        <ExternalLink href="https://www.redditinc.com/advertise" collapsed={collapsed}>Advertise</ExternalLink>
        <ExternalLink href="/rules" collapsed={collapsed}>Reddit Rules</ExternalLink>
        <ExternalLink href="/policies/privacy" collapsed={collapsed}>Privacy Policy</ExternalLink>
      </Section>
    </nav>
  )
}

function Section({ title, collapsed, children }: { title: string; collapsed: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      {!collapsed && <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>}
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function NavLink({ href, icon, label, active, collapsed }: {
  href: string; icon: React.ReactNode; label: string; active?: boolean; collapsed: boolean
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-2 rounded-md px-2 py-2 text-sm",
        active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )
}

function ExternalLink({ href, children, collapsed }: { href: string; children: React.ReactNode; collapsed: boolean }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className="block truncate rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
      title={collapsed ? children as string : undefined}
    >
      {!collapsed && children}
    </a>
  )
}
