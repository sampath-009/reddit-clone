import { getPopularSubreddits } from '@/lib/reddit'
import { TrendingUp, Users, ExternalLink } from 'lucide-react'

export default async function TrendingOnReddit() {
  try {
    const items = await getPopularSubreddits(10)
    
    return (
      <div className="space-y-2">
        {items.map((subreddit) => (
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
  } catch (e: any) {
    console.error('Failed to fetch popular subreddits:', e)
    return (
      <div className="text-sm text-muted-foreground p-3 text-center">
        Couldn't load Reddit ({String(e.message)})
      </div>
    )
  }
}
