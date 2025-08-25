'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Ctx = { collapsed: boolean; toggle: () => void; setCollapsed: (v: boolean) => void }
const SidebarCtx = createContext<Ctx>({ collapsed: false, toggle: () => {}, setCollapsed: () => {} })

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  
  useEffect(() => { 
    const v = localStorage.getItem('sidebar:collapsed'); 
    if (v) setCollapsed(v === '1') 
  }, [])
  
  useEffect(() => { 
    localStorage.setItem('sidebar:collapsed', collapsed ? '1' : '0') 
  }, [collapsed])
  
  const toggle = () => setCollapsed(c => !c)
  
  return <SidebarCtx.Provider value={{ collapsed, toggle, setCollapsed }}>{children}</SidebarCtx.Provider>
}

export const useSidebar = () => useContext(SidebarCtx)
