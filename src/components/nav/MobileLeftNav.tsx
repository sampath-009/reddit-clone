'use client'
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import LeftNav from "./LeftNav"

export default function MobileLeftNav() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="lg:hidden relative">
      <Button 
        ref={buttonRef}
        variant="ghost" 
        size="icon" 
        className="lg:hidden" 
        aria-label="Open menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Menu */}
          <div 
            ref={menuRef}
            className="absolute left-0 top-full mt-2 w-64 rounded-lg border bg-card p-4 shadow-lg z-50 max-h-[80vh] overflow-y-auto"
          >
            <LeftNav />
          </div>
        </>
      )}
    </div>
  )
}
