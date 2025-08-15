'use client'

import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown, MessageCircle, Share, MoreHorizontal, Clock } from 'lucide-react'
import { formatTimeAgo, formatNumber } from '@/lib/utils'
import { sanityClient } from '@/lib/sanity'
// import { vote } from '@/lib/actions'
// import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

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
}

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // const { isSignedIn, user } = useUser()
  const isSignedIn = false // Temporary mock

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = `*[_type == "post"] | order(createdAt desc) {
          _id,
          title,
          content,
          imageUrl,
          linkUrl,
          postType,
          author->{
            _id,
            username,
            imageUrl
          },
          subreddit->{
            _id,
            name
          },
          upvotes,
          downvotes,
          "commentCount": count(*[_type == "comment" && post._ref == ^._id]),
          createdAt
        }`
        const result = await sanityClient.fetch(query)
        setPosts(result)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleVote = async (postId: string, voteType: 'upvote' | 'downvote') => {
    if (!isSignedIn) return

    try {
      // await vote(postId, undefined, voteType)
      console.log(`Voting ${voteType} on post ${postId} - temporarily disabled`)
      // Refresh posts to get updated vote counts
      const query = `*[_type == "post"] | order(createdAt desc) {
        _id,
        title,
        content,
        imageUrl,
        linkUrl,
        postType,
        author->{
          _id,
          username,
          imageUrl
        },
        subreddit->{
          _id,
          name
        },
        upvotes,
        downvotes,
        "commentCount": count(*[_type == "comment" && post._ref == ^._id]),
        createdAt
      }`
      const result = await sanityClient.fetch(query)
      setPosts(result)
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
    console.log(`Opening comments for post ${postId}`)
  }

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log(`Sharing post ${postId}`)
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
      </div>
    )
  }

  return (
    <div className="space-y-4">
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
                    className="p-1 hover:bg-gray-200"
                    disabled={!isSignedIn}
                  >
                    <ArrowUp className="h-5 w-5 text-gray-600 hover:text-orange-500" />
                  </Button>
                  <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                    {formatNumber((post.upvotes?.length || 0) - (post.downvotes?.length || 0))}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(post._id, 'downvote')}
                    className="p-1 hover:bg-gray-200"
                    disabled={!isSignedIn}
                  >
                    <ArrowDown className="h-5 w-5 text-gray-600 hover:text-blue-500" />
                  </Button>
                </div>

                {/* Comments */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleComment(post._id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
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
              </div>

              {/* More Options */}
              <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
