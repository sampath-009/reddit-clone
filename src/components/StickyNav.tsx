'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ChevronRightIcon } from '@radix-ui/react-icons'

const links = [
  { id: 'showcase', label: 'Popular Posts' },
  { id: 'communities', label: 'Communities' },
  { id: 'features', label: 'Features' },
]

export default function StickyNav() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [active, setActive] = useState('showcase')

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting && setActive(e.target.id))
    }, { rootMargin: '-40% 0px -60% 0px' })
    
    links.forEach(l => {
      const el = document.getElementById(l.id)
      if (el) obs.observe(el)
    })
    
    return () => obs.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div 
        style={{ scaleX }} 
        className="fixed inset-x-0 top-0 z-40 h-1 origin-left bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" 
      />
      
      {/* Sticky navigation */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/70 backdrop-blur-md">
        <div className="container flex items-center gap-6 py-4">
          {links.map(l => (
            <motion.button
              key={l.id}
              onClick={() => scrollToSection(l.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`text-sm font-medium transition-colors ${
                active === l.id 
                  ? 'text-orange-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {l.label}
            </motion.button>
          ))}
          
          <div className="ml-auto flex items-center text-xs text-muted-foreground">
            <span>Scroll to explore</span>
            <ChevronRightIcon className="ml-1 h-3 w-3" />
          </div>
        </div>
      </div>
    </>
  )
}
