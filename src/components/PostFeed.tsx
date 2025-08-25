'use client'

import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown, MessageCircle, Share, MoreHorizontal, Clock, Users, Globe, Trash2, Link as LinkIcon } from 'lucide-react'
import { formatTimeAgo, formatNumber } from '@/lib/utils'
import { sanityClient } from '@/lib/sanity'
import { vote, getVoteStatus, getFollowedUsersPosts } from '@/lib/actions'
import { deletePostAction } from '@/app/actions/reddit'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getMockPosts } from '@/lib/mockData'
import Comments from './Comments'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface Post {
  _id: string
  title: string
  content?: string
  imageUrl?: string
  linkUrl?: string
  author: {
    _id: string
    username: string
    imageUrl?: string
    clerkId?: string
  }
  subreddit: {
    _id: string
    name: string
  }
  upvotes: any[]
  downvotes: any[]
  commentCount: number
  createdAt: string
  postType: 'text' | 'image' | 'link'
  userVote?: number // 1 for upvote, -1 for downvote, 0 for no vote
}

interface PostFeedProps {
  sortBy?: 'home' | 'popular' | 'all'
  communityFilter?: string
  initialFeedType?: 'following' | 'all'
}

export default function PostFeed({ sortBy = 'home', communityFilter, initialFeedType = 'following' }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showComments, setShowComments] = useState<string | null>(null)
  const [feedType, setFeedType] = useState<'following' | 'all'>(initialFeedType)
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    setFeedType(initialFeedType)
  }, [initialFeedType])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let result: Post[] = []

        if (sortBy === 'home' && isSignedIn && feedType === 'following') {
          // Get posts from followed users
          result = await getFollowedUsersPosts()
          
          if (result.length === 0) {
            // If no posts from followed users, show all posts with a message
            console.log('No posts from followed users, showing all posts')
            result = await fetchAllPosts()
          }
        } else {
          // Fetch all posts with sorting
          result = await fetchAllPosts()
        }

        if (result && result.length > 0) {
          // Fetch user's vote status for each post if signed in
          if (isSignedIn && user) {
            const postsWithVotes = await Promise.all(
              result.map(async (post: Post) => {
                try {
                  const voteStatus = await getVoteStatus(post._id, undefined, user.id)
                  return { ...post, userVote: voteStatus }
                } catch (error) {
                  console.error('Error fetching vote status:', error)
                  return { ...post, userVote: 0 }
                }
              })
            )
            setPosts(postsWithVotes)
          } else {
            setPosts(result)
          }
        } else {
          console.log('No posts from Sanity, using mock data')
          // Fall back to mock data if no posts from Sanity
          setPosts(getMockPosts(sortBy))
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          sanityConfig: {
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
            hasToken: !!process.env.SANITY_API_TOKEN
          }
        })
        // Fall back to mock data on error
        setPosts(getMockPosts(sortBy))
      } finally {
        setIsLoading(false)
      }
    }

    const fetchAllPosts = async () => {
      // For now, use simple sorting that works with Sanity
      let sortField = 'createdAt'
      let sortDirection = 'desc'
      
      if (sortBy === 'popular') {
        // Sort by comment count for popularity (simplified)
        sortField = 'commentCount'
        sortDirection = 'desc'
      }

      const query = `*[_type == "post"${communityFilter ? ' && subreddit._ref == $communityId' : ''}] | order(${sortField} ${sortDirection}) {
        _id,
        title,
        content,
        imageUrl,
        linkUrl,
        postType,
        author->{
          _id,
          username,
          imageUrl,
          clerkId
        },
        subreddit->{
          _id,
          name,
          displayName
        },
        upvotes,
        downvotes,
        "commentCount": count(*[_type == "comment" && post._ref == ^._id]),
        createdAt
      }`
      return await sanityClient.fetch(query, communityFilter ? { communityId: communityFilter } : {})
    }

    // Test Sanity connection first
    const testSanity = async () => {
      try {
        console.log('Testing Sanity connection...')
        const testQuery = `*[_type == "post"][0...1]`
        const testResult = await sanityClient.fetch(testQuery)
        console.log('Sanity test result:', testResult)
        
        if (testResult && testResult.length > 0) {
          console.log('Sanity is working, posts found:', testResult.length)
        } else {
          console.log('Sanity is working but no posts found')
        }
      } catch (error) {
        console.error('Sanity connection test failed:', error)
      }
    }
    
    testSanity()
    fetchPosts()
  }, [sortBy, isSignedIn, user, feedType])

  const handleVote = async (postId: string, voteType: 'upvote' | 'downvote') => {
    if (!isSignedIn || !user) return

    try {
      const result = await vote(voteType, postId, undefined)
      
      if (result.success) {
        // Update the post's vote count optimistically
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post._id === postId) {
              const currentVote = post.userVote || 0
              let newVote = 0
              
              if (result.action === 'removed') {
                // Vote was removed
                if (voteType === 'upvote') {
                  newVote = currentVote === 1 ? 0 : currentVote
                } else {
                  newVote = currentVote === -1 ? 0 : currentVote
                }
              } else if (result.action === 'updated') {
                // Vote was changed
                newVote = voteType === 'upvote' ? 1 : -1
              } else {
                // New vote was created
                newVote = voteType === 'upvote' ? 1 : -1
              }
              
              return { ...post, userVote: newVote }
            }
            return post
          })
        )
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const handleComment = (postId: string) => {
    setShowComments(showComments === postId ? null : postId)
  }

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log(`Sharing post ${postId}`)
  }

  const handleDelete = async (postId: string) => {
    if (!isSignedIn || !user) return

    try {
      const result = await deletePostAction({ postId, clerkUserId: user.id })
      if (result.ok) {
        toast.success('Post deleted!')
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId))
      } else {
        toast.error(result.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  const toggleFeedType = () => {
    setFeedType(feedType === 'following' ? 'all' : 'following')
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-500">Be the first to create a post!</p>
        <div className="mt-4 p-4 bg-gray-100 rounded text-left text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Posts loaded: {posts.length}</p>
          <p>Loading state: {isLoading ? 'Yes' : 'No'}</p>
          <p>User signed in: {isSignedIn ? 'Yes' : 'No'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Debug:</strong> {posts.length} posts loaded. 
          {posts.length > 0 && posts[0]._id.startsWith('1') ? ' Using mock data.' : ' Using Sanity data.'}
        </p>
      </div>
      
      {/* Feed Type Toggle (only show on home page) */}
      {sortBy === 'home' && isSignedIn && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant={feedType === 'following' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFeedType('following')}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Following</span>
              </Button>
              <Button
                variant={feedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFeedType('all')}
                className="flex items-center space-x-2"
              >
                <Globe className="h-4 w-4" />
                <span>All Posts</span>
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              {feedType === 'following' ? 'Posts from people you follow' : 'All posts'}
            </div>
          </div>
        </div>
      )}
      
      {/* Sorting Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {sortBy === 'popular' && (
              <>
                <span className="text-2xl">🔥</span>
                <span className="font-medium text-gray-900">Popular Posts</span>
              </>
            )}
            {sortBy === 'all' && (
              <>
                <span className="text-2xl">🌐</span>
                <span className="font-medium text-gray-900">All Posts</span>
              </>
            )}
            {sortBy === 'home' && (
              <>
                <span className="text-2xl">🏠</span>
                <span className="font-medium text-gray-900">
                  {feedType === 'following' ? 'Posts from Following' : 'Latest Posts'}
                </span>
              </>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      
      {posts.map((post) => (
        <div key={post._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Post Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <span className="font-medium text-gray-900">r/{post.subreddit.name}</span>
              <span>•</span>
              <span>Posted by u/{post.author.username}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(new Date(post.createdAt))}</span>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
            {post.content && (
              <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p>
            )}
            {post.imageUrl && (
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-64 object-cover rounded-md mt-3"
              />
            )}
            {post.linkUrl && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <a 
                  href={post.linkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {post.linkUrl}
                </a>
              </div>
            )}
          </div>

          {/* Post Actions */}
          <div className="px-4 py-3 bg-gray-50">
            <div className="flex items-center justify-between">
              {/* Voting */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(post._id, 'upvote')}
                    className={`p-1 hover:bg-gray-200 ${
                      post.userVote === 1 ? 'text-orange-500 bg-orange-50' : 'text-gray-600'
                    }`}
                    disabled={!isSignedIn}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                    {formatNumber((post.upvotes?.length || 0) - (post.downvotes?.length || 0))}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(post._id, 'downvote')}
                    className={`p-1 hover:bg-gray-200 ${
                      post.userVote === -1 ? 'text-blue-500 bg-blue-50' : 'text-gray-600'
                    }`}
                    disabled={!isSignedIn}
                  >
                    <ArrowDown className="h-5 w-5" />
                  </Button>
                </div>

                {/* Comments */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleComment(post._id)}
                  className={`flex items-center space-x-1 ${
                    showComments === post._id ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{formatNumber(post.commentCount)}</span>
                </Button>

                {/* Share */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(post._id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <Share className="h-4 w-4" />
                  <span className="text-sm">Share</span>
                </Button>

                {/* More Options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(window.location.href)}>
                      <LinkIcon className="mr-2 h-4 w-4" /> Copy link
                    </DropdownMenuItem>
                    {isSignedIn && user && post.author.clerkId === user.id && (
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDelete(post._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          {showComments === post._id && (
            <div className="border-t border-gray-200">
              <Comments postId={post._id} onClose={() => setShowComments(null)} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
