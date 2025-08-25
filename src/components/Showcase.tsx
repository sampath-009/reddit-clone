'use client'

import { motion } from 'framer-motion'
import { ArrowUp, MessageCircle, Share2, Bookmark } from 'lucide-react'

const showcase = [
  { 
    tag: 'r/webdev', 
    title: 'My journey from zero to web dev in 2024', 
    content: 'Started with HTML/CSS in January, now building full-stack apps. Here\'s what I learned...',
    stats: '12h ago • 89 comments • 1.2k upvotes',
    color: 'from-orange-500 to-red-500'
  },
  { 
    tag: 'r/pics', 
    title: 'Amazing sunset from my balcony in Tokyo', 
    content: 'The colors were absolutely incredible tonight. Nature never fails to amaze me.',
    stats: '6h ago • 45 comments • 2.8k upvotes',
    color: 'from-blue-500 to-purple-500'
  },
  { 
    tag: 'r/technology', 
    title: 'LLMs & agents: state of the art in 2025', 
    content: 'Deep dive into the latest developments in large language models and AI agents...',
    stats: '4h ago • 320 comments • 5.1k upvotes',
    color: 'from-green-500 to-teal-500'
  },
  { 
    tag: 'r/learnprogramming', 
    title: 'Complete beginner guide to React hooks', 
    content: 'I struggled with hooks for months. Here\'s everything I wish I knew from the start...',
    stats: '8h ago • 156 comments • 890 upvotes',
    color: 'from-pink-500 to-rose-500'
  },
  { 
    tag: 'r/science', 
    title: 'New study shows coffee might extend lifespan', 
    content: 'Research from Harvard suggests moderate coffee consumption could have surprising benefits...',
    stats: '2h ago • 234 comments • 3.7k upvotes',
    color: 'from-indigo-500 to-blue-500'
  },
  { 
    tag: 'r/gaming', 
    title: 'Indie game dev success story: 0 to 100k sales', 
    content: 'After 3 years of development, my solo project finally took off. Here\'s what worked...',
    stats: '10h ago • 89 comments • 1.5k upvotes',
    color: 'from-yellow-500 to-orange-500'
  },
]

export default function Showcase() {
  return (
    <div className="space-y-4">
      {showcase.map((post, i) => (
        <motion.div
          key={post.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
          whileHover={{ y: -2, scale: 1.01 }}
          className="group block rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${post.color}`} />
              <span className="text-sm font-medium text-muted-foreground">{post.tag}</span>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="text-xs text-muted-foreground"
            >
              {post.stats}
            </motion.div>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {post.title}
          </h3>
          
          {/* Content preview */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {post.content}
          </p>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-600 transition-colors"
              >
                <ArrowUp className="h-4 w-4" />
                <span>Upvote</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Comment</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-green-600 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </motion.button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-muted-foreground hover:text-purple-600 transition-colors"
            >
              <Bookmark className="h-4 w-4" />
            </motion.button>
          </div>
          
          {/* Hover effect line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 origin-left"
          />
        </motion.div>
      ))}
    </div>
  )
}
