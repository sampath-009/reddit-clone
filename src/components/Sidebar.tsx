'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, Calendar, Award } from 'lucide-react'
import { sanityClient } from '@/lib/sanity'
import CreateCommunity from './CreateCommunity'

interface Subreddit {
  _id: string
  name: string
  description: string
  members: any[]
  imageUrl?: string
  createdAt: string
}

export default function Sidebar() {
  const [communities, setCommunities] = useState<Subreddit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const query = `*[_type == "subreddit"] | order(createdAt desc)[0...5] {
          _id,
          name,
          description,
          members,
          imageUrl,
          createdAt
        }`
        const result = await sanityClient.fetch(query)
        setCommunities(result)
      } catch (error) {
        console.error('Error fetching communities:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunities()
  }, [])

  const trendingTopics = [
    { title: 'AI Breakthroughs in 2024', community: 'r/artificial', upvotes: '15.2k' },
    { title: 'Best Programming Languages to Learn', community: 'r/cscareerquestions', upvotes: '8.7k' },
    { title: 'Space Exploration Updates', community: 'r/space', upvotes: '12.1k' },
    { title: 'Climate Change Solutions', community: 'r/environment', upvotes: '6.9k' },
  ]

  return (
    <div className="space-y-6">
      {/* Create Community */}
      <CreateCommunity />

      {/* Community Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">About Reddit Clone</h2>
        <p className="text-gray-600 text-sm mb-4">
          The front page of the internet. Join communities, share content, and discover what's trending.
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{communities.length} communities</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Created 2024</span>
          </div>
        </div>
      </div>

      {/* Communities */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <span>Communities</span>
        </h3>
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : communities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No communities yet</p>
          ) : (
            communities.map((community) => (
              <div key={community._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">r/{community.name}</div>
                  <div className="text-sm text-gray-500">{community.description}</div>
                  <div className="text-xs text-gray-400">{community.members?.length || 0} members</div>
                </div>
                <button className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full hover:bg-orange-600 transition-colors">
                  Join
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Award className="h-5 w-5 text-orange-500" />
          <span>Trending Today</span>
        </h3>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <div className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                {topic.title}
              </div>
              <div className="text-xs text-gray-500">
                {topic.community} • {topic.upvotes} upvotes
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-xs text-gray-500 space-y-2">
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:text-gray-700">Help</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">Reddit Coins</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">Reddit Premium</a>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:text-gray-700">Communities</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">About</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">Careers</a>
          </div>
        </div>
      </div>
    </div>
  )
}
