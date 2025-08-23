'use client'

import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import PostFeed from '@/components/PostFeed'
import CreatePost from '@/components/CreatePost'

export default function Home() {
  const searchParams = useSearchParams()
  const feedType = searchParams.get('feed') === 'following' ? 'following' : 'all'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <CreatePost />
            <PostFeed sortBy="home" initialFeedType={feedType} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
