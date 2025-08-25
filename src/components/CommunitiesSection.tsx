'use client'

import { motion } from 'framer-motion'
import { Users, TrendingUp, Star, Hash } from 'lucide-react'

const communities = [
  {
    name: 'r/programming',
    description: 'Computer programming for professionals and enthusiasts',
    members: '4.2M',
    online: '12.5k',
    icon: '💻',
    color: 'from-blue-500 to-purple-500',
    trending: true
  },
  {
    name: 'r/technology',
    description: 'Technology news and discussions',
    members: '8.1M',
    online: '25.3k',
    icon: '🚀',
    color: 'from-green-500 to-teal-500',
    trending: true
  },
  {
    name: 'r/science',
    description: 'Scientific discoveries and research',
    members: '32.1M',
    online: '45.7k',
    icon: '🔬',
    color: 'from-indigo-500 to-blue-500',
    trending: false
  },
  {
    name: 'r/gaming',
    description: 'Video games and gaming culture',
    members: '38.5M',
    online: '67.2k',
    icon: '🎮',
    color: 'from-pink-500 to-rose-500',
    trending: true
  },
  {
    name: 'r/learnprogramming',
    description: 'A subreddit for all questions related to programming',
    members: '5.2M',
    online: '8.9k',
    icon: '📚',
    color: 'from-yellow-500 to-orange-500',
    trending: false
  },
  {
    name: 'r/webdev',
    description: 'Web development resources and discussions',
    members: '2.8M',
    online: '6.1k',
    icon: '🌐',
    color: 'from-red-500 to-pink-500',
    trending: true
  }
]

export default function CommunitiesSection() {
  return (
    <section id="communities" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Popular Communities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the most active communities and start engaging with like-minded people
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community, index) => (
            <motion.div
              key={community.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Trending badge */}
              {community.trending && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1"
                >
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </motion.div>
              )}

              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${community.color} flex items-center justify-center text-2xl`}>
                  {community.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-orange-600 transition-colors">
                    {community.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {community.description}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{community.members}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>{community.online}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Join
                </motion.button>
              </div>

              {/* Hover effect */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 origin-left rounded-b-2xl"
              />
            </motion.div>
          ))}
        </div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <Hash className="h-5 w-5" />
            View All Communities
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
