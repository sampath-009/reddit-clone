'use client'

import { useState } from 'react'
import { Menu, Plus, Bell, User } from 'lucide-react'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Search from './Search'
import Notifications from './Notifications'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn, user, isLoaded } = useUser()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Reddit Clone</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  usePathname() === "/" 
                    ? "text-orange-600 bg-orange-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                Home
              </Link>
              <Link 
                href="/popular" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  usePathname() === "/popular" 
                    ? "text-orange-600 bg-orange-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                Popular
              </Link>
              <Link 
                href="/all" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  usePathname() === "/all" 
                    ? "text-orange-600 bg-orange-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                All
              </Link>
              <Link 
                href="/r/programming" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  usePathname().startsWith("/r/programming")
                    ? "text-orange-600 bg-orange-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                r/programming
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <Search />

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {!isLoaded ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : isSignedIn ? (
              <>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
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
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  usePathname() === "/" 
                    ? "text-orange-600 bg-orange-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/popular" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  usePathname() === "/popular" 
                    ? "text-orange-600 bg-orange-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Popular
              </Link>
              <Link 
                href="/all" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  usePathname() === "/all" 
                    ? "text-orange-600 bg-orange-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                All
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
