'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, ExternalLink } from 'lucide-react'

interface RedditCommunity {
  name: string
  title: string
  subscribers: number
  icon: string
  description: string
  url: string
}

export default function TrendingOnRedditWrapper() {
  const [communities, setCommunities] = useState<RedditCommunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPopularCommunities = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Use the server action directly
        const res = await fetch('/api/reddit/popular', {
          cache: 'no-store'
        })
        
        const data = await res.json()
        
        if (!data?.ok) {
          setError(data?.error || 'Could not load Reddit data')
          return
        }

        setCommunities(data.items)
        // Store fallback status if available
        if (data.fallback) {
          console.log('📋 Using fallback data due to Reddit rate limiting')
        }
      } catch (err) {
        setError('Error loading popular communities')
        console.error('Error fetching popular communities:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPopularCommunities()
  }, [])

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-muted-foreground p-3 text-center">
        {error}
      </div>
    )
  }

  if (communities.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-3 text-center">
        No popular communities found
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {communities.map((subreddit) => (
        <a
          key={subreddit.name}
          href={subreddit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors group"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {subreddit.icon ? (
              <img 
                src={subreddit.icon} 
                alt="" 
                className="h-8 w-8 rounded-full object-cover flex-shrink-0" 
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold">r/</span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                r/{subreddit.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {subreddit.title}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {Intl.NumberFormat().format(subreddit.subscribers)} members
                </span>
              </div>
            </div>
          </div>
          
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Live</span>
              <ExternalLink className="h-3 w-3" />
            </div>
        </a>
      ))}
    </div>
  )
}
