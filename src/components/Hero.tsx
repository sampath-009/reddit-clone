'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, TrendingUp, Users, Award } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-tr from-orange-500/40 via-red-500/40 to-pink-500/40 blur-3xl"
          style={{ animation: 'hue 12s linear infinite' }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className="absolute bottom-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-blue-400/30 via-purple-500/30 to-indigo-500/30 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
          className="absolute top-1/2 left-[-100px] h-64 w-64 rounded-full bg-gradient-to-tr from-green-400/20 via-emerald-500/20 to-teal-500/20 blur-3xl"
        />
      </div>

      <div className="container relative py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            The front page of the{' '}
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              internet
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl"
          >
            Join communities, share content, and discover what's trending. Built with Next.js + Framer Motion for a modern, interactive experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="/create"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-white font-medium hover:shadow-lg transition-all duration-300"
            >
              Create Post
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="#showcase"
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-medium hover:bg-accent transition-all duration-300"
            >
              Explore Communities
              <TrendingUp className="h-4 w-4" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold">10K+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-muted-foreground">Communities</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <div className="mx-auto w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-3">
              <Award className="h-6 w-6 text-pink-600" />
            </div>
            <div className="text-2xl font-bold">1M+</div>
            <div className="text-sm text-muted-foreground">Posts Shared</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
