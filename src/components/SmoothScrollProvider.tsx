'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ 
      lerp: 0.1, 
      smoothWheel: true,
      smoothTouch: true,
      duration: 1.2
    })
    
    function raf(time: number) { 
      lenis.raf(time); 
      requestAnimationFrame(raf) 
    }
    
    requestAnimationFrame(raf)
    
    return () => { 
      (lenis as any).destroy?.() 
    }
  }, [])
  
  return <>{children}</>
}
