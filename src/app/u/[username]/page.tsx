'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { User, Calendar, Award, MessageCircle, TrendingUp, Clock } from 'lucide-react'
import { sanityClient } from '@/lib/sanity'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatTimeAgo, formatNumber } from '@/lib/utils'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

interface UserProfile {
  _id: string
  username: string
  imageUrl?: string
  karma: number
  createdAt: string
  bio?: string
}

interface UserPost {
  _id: string
  title: string
  content?: string
  imageUrl?: string
  linkUrl?: string
  createdAt: string
  subreddit: {
    name: string
  }
  upvotes: any[]
  downvotes: any[]
  commentCount: number
}

interface UserComment {
  _id: string
  text: string
  createdAt: string
  post: {
    _id: string
    title: string
    subreddit: {
      name: string
    }
  }
  upvotes: any[]
  downvotes: any[]
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<UserPost[]>([])
  const [comments, setComments] = useState<UserComment[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [username])

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const profileQuery = `*[_type == "user" && username == $username][0] {
        _id,
        username,
        imageUrl,
        karma,
        createdAt,
        bio
      }`
      
      const userProfile = await sanityClient.fetch(profileQuery, { username })
      
      if (!userProfile) {
        // User not found
        setProfile(null)
        setIsLoading(false)
        return
      }

      setProfile(userProfile)

      // Fetch user posts
      const postsQuery = `*[_type == "post" && author->username == $username] | order(createdAt desc) {
        _id,
        title,
        content,
        imageUrl,
        linkUrl,
        createdAt,
        subreddit->{ name },
        upvotes,
        downvotes,
        "commentCount": count(*[_type == "comment" && post._ref == ^._id])
      }`
      
      const userPosts = await sanityClient.fetch(postsQuery, { username })
      setPosts(userPosts)

      // Fetch user comments
      const commentsQuery = `*[_type == "comment" && author->username == $username] | order(createdAt desc) {
        _id,
        text,
        createdAt,
        post->{
          _id,
          title,
          subreddit->{ name }
        },
        upvotes,
        downvotes
      }`
      
      const userComments = await sanityClient.fetch(commentsQuery, { username })
      setComments(userComments)

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg p-12 text-center">
            <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
            <p className="text-gray-500">The user "u/{username}" doesn't exist or has been deleted.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.imageUrl} />
                  <AvatarFallback className="text-2xl font-bold">
                    {profile.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">u/{profile.username}</h1>
                    <div className="flex items-center space-x-1 text-orange-500">
                      <Award className="h-5 w-5" />
                      <span className="text-sm font-medium">{formatNumber(profile.karma)} karma</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatTimeAgo(new Date(profile.createdAt))}</span>
                    </div>
                  </div>
                  
                  {profile.bio && (
                    <p className="text-gray-700">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('posts')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'posts'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Posts ({posts.length})</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'comments'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Comments ({comments.length})</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'posts' ? (
                  <div className="space-y-4">
                    {posts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No posts yet. Start sharing your thoughts!</p>
                      </div>
                    ) : (
                      posts.map((post) => (
                        <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                            <span className="font-medium text-gray-900">r/{post.subreddit.name}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(new Date(post.createdAt))}</span>
                            </div>
                          </div>
                          
                          <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
                          
                          {post.content && (
                            <p className="text-gray-700 text-sm mb-3 line-clamp-2">{post.content}</p>
                          )}
                          
                          {post.imageUrl && (
                            <img 
                              src={post.imageUrl} 
                              alt={post.title}
                              className="w-full h-32 object-cover rounded-md mb-3"
                            />
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>↑ {formatNumber(post.upvotes?.length || 0)}</span>
                            <span>↓ {formatNumber(post.downvotes?.length || 0)}</span>
                            <span>💬 {formatNumber(post.commentCount)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No comments yet. Start the conversation!</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment._id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                            <span>Comment on</span>
                            <span className="font-medium text-gray-900">"{comment.post.title}"</span>
                            <span>in</span>
                            <span className="font-medium text-gray-900">r/{comment.post.subreddit.name}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(new Date(comment.createdAt))}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-900 mb-3">{comment.text}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>↑ {formatNumber(comment.upvotes?.length || 0)}</span>
                            <span>↓ {formatNumber(comment.downvotes?.length || 0)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
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
