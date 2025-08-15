'use client'

import { useState } from 'react'
import { Menu, Plus, Bell, User } from 'lucide-react'
// import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Search from './Search'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // const { isSignedIn, user } = useUser()
  const isSignedIn = false // Temporary mock

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
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Popular
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                All
              </a>
            </nav>
          </div>

          {/* Search Bar */}
          <Search />

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                  <Plus className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              </>
            ) : (
              <Button variant="outline" size="sm">
                Sign In
              </Button>
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
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Popular
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                All
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
