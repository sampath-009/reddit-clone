'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Users, Shield, Zap, Heart, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Real-time Discussions',
    description: 'Engage in live conversations with instant notifications and real-time updates',
    color: 'from-blue-500 to-purple-500'
  },
  {
    icon: Users,
    title: 'Community Building',
    description: 'Create and join communities around your interests with powerful moderation tools',
    color: 'from-green-500 to-teal-500'
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Enterprise-grade security with content moderation and user protection',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with Next.js 15 and optimized for the best performance experience',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Heart,
    title: 'User Experience',
    description: 'Beautiful dark mode design with smooth animations and intuitive interface',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: TrendingUp,
    title: 'Trending Content',
    description: 'Discover what\'s hot with our intelligent content ranking algorithm',
    color: 'from-indigo-500 to-blue-500'
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Choose Reddit Clone?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with modern technologies and designed for the best user experience
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6`}
              >
                <feature.icon className="h-8 w-8" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-orange-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 origin-left rounded-b-2xl"
              />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-200 dark:border-orange-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of users who are already building amazing communities and sharing incredible content
            </p>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Zap className="h-5 w-5" />
              Start Exploring Now
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
