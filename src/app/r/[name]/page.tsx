'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Hash, Users, Calendar, TrendingUp, Plus } from 'lucide-react'
import { sanityClient } from '@/lib/sanity'
import { formatTimeAgo, formatNumber } from '@/lib/utils'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import CreatePost from '@/components/CreatePost'
import PostFeed from '@/components/PostFeed'
import AppShell from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Community {
  _id: string
  name: string
  displayName: string
  description: string
  members: any[]
  createdAt: string
  creator: {
    username: string
  }
}

export default function CommunityPage() {
  const params = useParams()
  const communityName = params.name as string
  const [community, setCommunity] = useState<Community | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCommunity()
  }, [communityName])

  const fetchCommunity = async () => {
    try {
      const query = `*[_type == "subreddit" && name == $name][0] {
        _id,
        name,
        displayName,
        description,
        members,
        createdAt,
        creator->{
          username
        }
      }`
      
      const result = await sanityClient.fetch(query, { name: communityName })
      
      if (result) {
        setCommunity(result)
      } else {
        // Community not found
        setCommunity(null)
      }
    } catch (error) {
      console.error('Error fetching community:', error)
      setCommunity(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <AppShell right={<Sidebar />}>
          <div className="animate-pulse">
            <div className="bg-card rounded-lg p-6 mb-6">
              <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </AppShell>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <AppShell right={<Sidebar />}>
          <div className="bg-card rounded-lg p-12 text-center">
            <Hash className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Community Not Found</h1>
            <p className="text-muted-foreground">The community "r/{communityName}" doesn't exist or has been deleted.</p>
          </div>
        </AppShell>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AppShell right={<Sidebar />}>
        <div className="space-y-6">
          {/* Community Header */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <Hash className="h-8 w-8 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">r/{community.displayName}</h1>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                    Community
                  </span>
                </div>
                
                <p className="text-muted-foreground mb-3">{community.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{formatNumber(community.members?.length || 0)} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatTimeAgo(new Date(community.createdAt))}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>by u/{community.creator?.username}</span>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <Link href={`/r/${community.name}/submit`}>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Create Post */}
          <CreatePost preSelectedCommunity={community._id} />

          {/* Posts Feed */}
          <PostFeed sortBy="home" communityFilter={community._id} />
        </div>
      </AppShell>
    </div>
  )
}
