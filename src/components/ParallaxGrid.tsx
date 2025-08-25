'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { TrendingUp, Users, MessageCircle, ArrowUp } from 'lucide-react'

const items = [
  { 
    title: 'Community Spotlight', 
    subtitle: 'r/programming', 
    description: 'Latest discussions in web development',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
    stats: '2.1k members'
  },
  { 
    title: 'Trending Post', 
    subtitle: 'My journey from zero to hero', 
    description: 'Personal story that inspired many',
    icon: ArrowUp,
    color: 'from-blue-500 to-purple-500',
    stats: '15k upvotes'
  },
  { 
    title: 'Discussion Hub', 
    subtitle: 'r/technology', 
    description: 'AI and future tech conversations',
    icon: MessageCircle,
    color: 'from-green-500 to-teal-500',
    stats: '890 comments'
  },
  { 
    title: 'User Growth', 
    subtitle: 'r/learnprogramming', 
    description: 'Helping beginners learn to code',
    icon: Users,
    color: 'from-pink-500 to-rose-500',
    stats: '5.2k members'
  },
]

export default function ParallaxGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Card key={item.title} {...item} index={index} />
      ))}
    </div>
  )
}

function Card({ 
  title, 
  subtitle, 
  description, 
  icon: Icon, 
  color, 
  stats, 
  index 
}: { 
  title: string
  subtitle: string
  description: string
  icon: any
  color: string
  stats: string
  index: number
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-40, 40], [8, -8])
  const rotateY = useTransform(x, [-40, 40], [-8, 8])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ 
        y: -8, 
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        scale: 1.02
      }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
        x.set(e.clientX - (r.left + r.width / 2))
        y.set(e.clientY - (r.top + r.height / 2))
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card cursor-pointer"
      style={{ perspective: 800 }}
    >
      <motion.div style={{ rotateX, rotateY }}>
        {/* Header with gradient icon */}
        <div className={`p-6 bg-gradient-to-br ${color} text-white`}>
          <div className="flex items-center justify-between mb-3">
            <Icon className="h-8 w-8" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full"
            >
              {stats}
            </motion.div>
          </div>
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-sm opacity-90">{subtitle}</p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
          
          {/* Hover effect indicator */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="flex items-center text-xs text-orange-600 font-medium"
          >
            <span>Hover for 3D effect</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-1"
            >
              →
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  )
}
