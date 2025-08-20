'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, Calendar, Award, X, ArrowUp, MessageCircle, Share2 } from 'lucide-react'
import { sanityClient } from '@/lib/sanity'
import CreateCommunity from './CreateCommunity'

interface Subreddit {
  _id: string
  name: string
  displayName?: string
  description: string
  members: any[]
  imageUrl?: string
  createdAt: string
  memberCount?: number
}

interface TrendingTopic {
  id: string
  title: string
  community: string
  upvotes: string
  comments: string
  content: string
  author: string
  timeAgo: string
}

export default function Sidebar() {
  const [communities, setCommunities] = useState<Subreddit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showTrendingModal, setShowTrendingModal] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null)

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const query = `*[_type == "subreddit"] | order(createdAt desc)[0...5] {
          _id,
          name,
          displayName,
          description,
          members,
          imageUrl,
          createdAt,
          "memberCount": count(members)
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

  const trendingTopics: TrendingTopic[] = [
    { 
      id: '1',
      title: 'AI Breakthroughs in 2024: What\'s Next?', 
      community: 'r/artificial', 
      upvotes: '15.2k',
      comments: '2.3k',
      content: 'The latest developments in artificial intelligence are reshaping how we think about technology. From GPT-5 rumors to new breakthroughs in computer vision, 2024 is proving to be a pivotal year for AI research and development.',
      author: 'u/tech_enthusiast',
      timeAgo: '2 hours ago'
    },
    { 
      id: '2',
      title: 'Best Programming Languages to Learn in 2024', 
      community: 'r/cscareerquestions', 
      upvotes: '8.7k',
      comments: '1.1k',
      content: 'With the tech industry evolving rapidly, which programming languages should developers focus on? Python continues to dominate, but Rust and Go are gaining serious traction. Let\'s discuss the pros and cons of each.',
      author: 'u/code_master',
      timeAgo: '4 hours ago'
    },
    { 
      id: '3',
      title: 'Space Exploration Updates: Mars Mission Progress', 
      community: 'r/space', 
      upvotes: '12.1k',
      comments: '856',
      content: 'NASA\'s latest Mars rover has discovered fascinating geological formations that could indicate past water activity. This discovery opens up new possibilities for understanding the Red Planet\'s history.',
      author: 'u/space_explorer',
      timeAgo: '6 hours ago'
    },
    { 
      id: '4',
      title: 'Climate Change Solutions: Community Action Plans', 
      community: 'r/environment', 
      upvotes: '6.9k',
      comments: '432',
      content: 'Local communities are taking action against climate change through innovative solutions. From urban farming initiatives to renewable energy projects, people are making a difference at the grassroots level.',
      author: 'u/eco_warrior',
      timeAgo: '8 hours ago'
    },
  ]

  const handleTopicClick = (topic: TrendingTopic) => {
    setSelectedTopic(topic)
    setShowTrendingModal(true)
  }

  const closeTrendingModal = () => {
    setShowTrendingModal(false)
    setSelectedTopic(null)
  }

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
                  <div className="font-medium text-gray-900">r/{community.displayName || community.name}</div>
                  <div className="text-sm text-gray-500">{community.description}</div>
                  <div className="text-xs text-gray-400">{community.memberCount || 0} members</div>
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Award className="h-5 w-5 text-orange-500" />
            <span>Trending Today</span>
          </h3>
          <button 
            onClick={() => setShowTrendingModal(true)}
            className="text-xs text-orange-500 hover:text-orange-600 font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={topic.id} className="p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={() => handleTopicClick(topic)}>
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

      {/* Trending Topics Modal */}
      {showTrendingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Award className="h-6 w-6 text-orange-500" />
                <span>Trending Today</span>
              </h3>
              <button onClick={closeTrendingModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {selectedTopic ? (
              // Single topic view
              <div>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{selectedTopic.title}</h4>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    <p>{selectedTopic.content}</p>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    By {selectedTopic.author} • {selectedTopic.timeAgo} • {selectedTopic.community}
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-gray-500 text-sm border-t pt-4">
                  <div className="flex items-center space-x-2 hover:text-orange-500 cursor-pointer">
                    <ArrowUp className="h-5 w-5" />
                    <span>{selectedTopic.upvotes}</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-orange-500 cursor-pointer">
                    <MessageCircle className="h-5 w-5" />
                    <span>{selectedTopic.comments} comments</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-orange-500 cursor-pointer">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedTopic(null)}
                  className="mt-6 text-orange-500 hover:text-orange-600 font-medium"
                >
                  ← Back to all trending topics
                </button>
              </div>
            ) : (
              // All topics grid view
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingTopics.map((topic) => (
                  <div 
                    key={topic.id} 
                    className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                      {topic.title}
                    </h4>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-3">
                      {topic.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{topic.community}</span>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <ArrowUp className="h-3 w-3" />
                          {topic.upvotes}
                        </span>
                        <span className="flex items-center space-x-2">
                          <MessageCircle className="h-3 w-3" />
                          {topic.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
