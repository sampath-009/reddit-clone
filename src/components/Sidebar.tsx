'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, Calendar, Award, X, ArrowUp, MessageCircle, Share2, Trash2, MoreHorizontal, LinkIcon } from 'lucide-react'
import { sanityClient } from '@/lib/sanity'
import { SUBREDDITS_FOR_LIST } from '@/lib/queries'
import { deleteCommunityAction, leaveCommunityAction, joinCommunityAction } from '@/app/actions/reddit'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import CreateCommunity from './CreateCommunity'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import TrendingOnRedditWrapper from './TrendingOnRedditWrapper'

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

interface Subreddit {
  _id: string
  name: string
  displayName?: string
  description: string
  members: any[]
  imageUrl?: string
  createdAt: string
  memberCount?: number
  creator: {
    _id: string
    username: string
    clerkId?: string
  }
  canDelete?: boolean
  isMember?: boolean
}

export default function Sidebar() {
  const [communities, setCommunities] = useState<Subreddit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showTrendingModal, setShowTrendingModal] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null)
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Only fetch if user is loaded and we have a clerkId
    if (!isLoaded || !user?.id) return

    const fetchCommunities = async () => {
      try {
        setIsLoading(true)
        const result = await sanityClient.fetch(SUBREDDITS_FOR_LIST, { clerkId: user.id })
        console.log('🔍 Fetched communities with canDelete:', result)
        
        // Debug: Log each community's info
        result.forEach((community: Subreddit, index: number) => {
          console.log(`🔍 Community ${index + 1}:`, {
            name: community.name,
            creator: community.creator,
            canDelete: community.canDelete,
            userClerkId: user.id
          })
        })
        
        setCommunities(result)
      } catch (error) {
        console.error('Error fetching communities:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunities()
  }, [isLoaded, user?.id])

  const handleDeleteCommunity = async (communityId: string) => {
    if (!isSignedIn || !user) return

    try {
      const result = await deleteCommunityAction({ subredditId: communityId, clerkUserId: user.id })
      if (result.ok) {
        toast.success('Community deleted!')
        setCommunities(prevCommunities => prevCommunities.filter(community => community._id !== communityId))
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to delete community')
      }
    } catch (error) {
      console.error('Error deleting community:', error)
      toast.error('Failed to delete community')
    }
  }

  const handleLeaveCommunity = async (communityId: string) => {
    if (!isSignedIn || !user) return

    try {
      const result = await leaveCommunityAction({ subredditId: communityId, clerkUserId: user.id })
      if (result.ok) {
        toast.success('Left community!')
        // Update the community to show as not joined
        setCommunities(prevCommunities => 
          prevCommunities.map(community => 
            community._id === communityId 
              ? { ...community, isMember: false }
              : community
          )
        )
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to leave community')
      }
    } catch (error) {
      console.error('Error leaving community:', error)
      toast.error('Failed to leave community')
    }
  }

  const handleJoinCommunity = async (communityId: string) => {
    if (!isSignedIn || !user) return

    try {
      const result = await joinCommunityAction({ subredditId: communityId, clerkUserId: user.id })
      if (result.ok) {
        toast.success('Joined community!')
        // Update the community to show as joined
        setCommunities(prevCommunities => 
          prevCommunities.map(community => 
            community._id === communityId 
              ? { ...community, isMember: true }
              : community
          )
        )
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to join community')
      }
    } catch (error) {
      console.error('Error joining community:', error)
      toast.error('Failed to join community')
    }
  }

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
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">About Reddit Clone</h2>
        <p className="text-muted-foreground text-sm mb-4">
          The front page of the internet. Join communities, share content, and discover what's trending.
        </p>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <span>Communities</span>
        </h3>
        <div className="space-y-3">
          {!isLoaded ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : !isSignedIn || !user ? (
            <div className="text-center py-4">
              <div className="text-gray-500">Sign in to see communities</div>
            </div>
          ) : isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : communities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No communities yet</p>
          ) : (
            communities.map((community) => (
              <div key={community._id} className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors">
                <div className="flex-1">
                  <div className="font-medium text-foreground">r/{community.displayName || community.name}</div>
                  <div className="text-sm text-muted-foreground">{community.description}</div>
                  <div className="text-xs text-muted-foreground">{community.memberCount || 0} members</div>
                  <div className="text-xs text-muted-foreground">Created by u/{community.creator?.username}</div>
                </div>
                {community.canDelete ? (
                  <div className="flex items-center space-x-2">
                    {community.isMember ? (
                      <button 
                        onClick={() => handleLeaveCommunity(community._id)}
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded-full hover:bg-gray-600 transition-colors"
                      >
                        Leave
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleJoinCommunity(community._id)}
                        className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full hover:bg-orange-600 transition-colors"
                      >
                        Join
                      </button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {community.canDelete && (
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteCommunity(community._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-blue-600 focus:text-blue-600"
                          onClick={() => {
                            // Copy community link to clipboard
                            navigator.clipboard.writeText(`${window.location.origin}/r/${community.name}`)
                            toast.success('Community link copied!')
                          }}
                        >
                          <LinkIcon className="mr-2 h-4 w-4" /> Copy Link
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    {community.isMember ? (
                      <button 
                        onClick={() => handleLeaveCommunity(community._id)}
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded-full hover:bg-gray-600 transition-colors"
                      >
                        Leave
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleJoinCommunity(community._id)}
                        className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full hover:bg-orange-600 transition-colors"
                      >
                        Join
                      </button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {community.canDelete && (
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteCommunity(community._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-blue-600 focus:text-blue-600"
                          onClick={() => {
                            // Copy community link to clipboard
                            navigator.clipboard.writeText(`${window.location.origin}/r/${community.name}`)
                            toast.success('Community link copied!')
                          }}
                        >
                          <LinkIcon className="mr-2 h-4 w-4" /> Copy Link
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Popular Communities from Reddit */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <span>Trending on Reddit</span>
        </h3>
        <TrendingOnRedditWrapper />
      </div>

      {/* Trending Topics */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
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
            <div key={topic.id} className="p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer" onClick={() => handleTopicClick(topic)}>
              <div className="font-medium text-foreground text-sm line-clamp-2 mb-1">
                {topic.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {topic.community} • {topic.upvotes} upvotes
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics Modal */}
      {showTrendingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center space-x-2">
                <Award className="h-6 w-6 text-orange-500" />
                <span>Trending Today</span>
              </h3>
              <button onClick={closeTrendingModal} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {selectedTopic ? (
              // Single topic view
              <div>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-foreground mb-3">{selectedTopic.title}</h4>
                  <div className="text-muted-foreground text-sm leading-relaxed">
                    <p>{selectedTopic.content}</p>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    By {selectedTopic.author} • {selectedTopic.timeAgo} • {selectedTopic.community}
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-muted-foreground text-sm border-t border-border pt-4">
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
                    className="p-4 border border-border rounded-lg hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <h4 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
                      {topic.title}
                    </h4>
                    <div className="text-xs text-muted-foreground mb-2">
                      {topic.community} • {topic.upvotes} upvotes • {topic.comments} comments
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {topic.content}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      By {topic.author} • {topic.timeAgo}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Links */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <a href="#" className="hover:text-foreground text-muted-foreground">About</a>
          <a href="#" className="hover:text-foreground text-muted-foreground">Help</a>
          <a href="#" className="hover:text-foreground text-muted-foreground">Blog</a>
          <a href="#" className="hover:text-foreground text-muted-foreground">Careers</a>
          <a href="#" className="hover:text-foreground text-muted-foreground">Communities</a>
          <a href="#" className="hover:text-foreground text-muted-foreground">Privacy</a>
        </div>
      </div>
    </div>
  )
}
