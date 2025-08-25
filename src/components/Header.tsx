'use client'

import { Menu, Plus, Bell, User } from 'lucide-react'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Search from './Search'
import Notifications from './Notifications'
import { ThemeToggle } from './ThemeToggle'
import MobileLeftNav from './nav/MobileLeftNav'
import { useSidebar } from './nav/SidebarContext'

export default function Header() {
  const { isSignedIn, user, isLoaded } = useUser()
  const { toggle } = useSidebar()

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Mobile Menu Button */}
            <MobileLeftNav />
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-foreground">Reddit Clone</span>
            </div>
            
            {/* Desktop sidebar toggle - hidden on mobile */}
            <button
              onClick={toggle}
              className="hidden lg:inline-flex items-center justify-center w-10 h-10 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <Search />

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {!isLoaded ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : isSignedIn ? (
              <>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full">
                  <Plus className="h-5 w-5" />
                </button>
                <Notifications />
                <UserButton />
              </>
            ) : (
              <SignInButton>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            )}
            

          </div>
        </div>


      </div>
    </header>
  )
}




