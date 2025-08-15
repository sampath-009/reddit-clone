import { sanityClient } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import PostFeed from '@/components/PostFeed'
import CreatePost from '@/components/CreatePost'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, Calendar } from 'lucide-react'

interface PageProps {
  params: {
    name: string
  }
}

export default async function CommunityPage({ params }: PageProps) {
  const { name } = params

  // Fetch community data
  const communityQuery = `*[_type == "subreddit" && name == $name][0] {
    _id,
    name,
    description,
    imageUrl,
    createdAt,
    "memberCount": count(members),
    creator->{
      username
    }
  }`
  
  const community = await sanityClient.fetch(communityQuery, { name })

  if (!community) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Community Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={community.imageUrl} />
              <AvatarFallback className="text-2xl font-bold bg-orange-500 text-white">
                r/{community.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">r/{community.name}</h1>
              <p className="text-gray-600">{community.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{community.memberCount} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created by u/{community.creator.username}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <CreatePost />
            <PostFeed />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Community</h3>
              <p className="text-gray-600 text-sm mb-4">{community.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Created</span>
                  <span>{new Date(community.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Members</span>
                  <span>{community.memberCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
