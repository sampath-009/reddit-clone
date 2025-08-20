'use client'

import { useState, useEffect } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const hideCursor = () => {
      setIsVisible(false)
    }

    const showCursor = () => {
      setIsVisible(true)
    }

    const handleMouseDown = () => {
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    // Add event listeners
    document.addEventListener('mousemove', updateCursorPosition)
    document.addEventListener('mouseenter', showCursor)
    document.addEventListener('mouseleave', hideCursor)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseover', handleMouseOver)

    // Hide default cursor
    document.body.style.cursor = 'none'

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', updateCursorPosition)
      document.removeEventListener('mouseenter', showCursor)
      document.removeEventListener('mouseleave', hideCursor)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseOver)
      document.body.style.cursor = 'auto'
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out"
      style={{
        left: position.x - 12, // Center the smaller crewmate on cursor
        top: position.y - 16,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Among Us Crewmate Cursor */}
      <div className={`relative transition-all duration-200 ${isClicking ? 'scale-110' : isHovering ? 'scale-125' : 'scale-100'}`}>
        {/* Main Body - Bean-shaped crewmate */}
        <div className={`w-6 h-8 bg-blue-300 rounded-full border border-blue-400 relative transition-all duration-200 ${isClicking ? 'bg-blue-200' : isHovering ? 'bg-blue-200' : ''}`} style={{
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
        }}>
          {/* Visor */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-blue-100 rounded-full border border-blue-200 opacity-80"></div>
          
          {/* Feet */}
          <div className="absolute -bottom-1 left-1 w-2 h-1 bg-blue-300 rounded-full border border-blue-400"></div>
          <div className="absolute -bottom-1 right-1 w-2 h-1 bg-blue-300 rounded-full border border-blue-400"></div>
          
          {/* Floating Bubble */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-200 rounded-full border border-blue-300 opacity-70 animate-bounce"></div>
        </div>
        
        {/* Jelly-like shine effect */}
        <div className="absolute top-0 left-1 w-2 h-2 bg-white opacity-30 rounded-full blur-sm"></div>
        <div className="absolute top-2 right-1 w-1 h-1 bg-blue-100 opacity-50 rounded-full"></div>
      </div>
    </div>
  )
}
