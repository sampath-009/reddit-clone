'use client'

import { useState, useEffect, useRef } from 'react'
import { Search as SearchIcon, X, Clock, TrendingUp, User, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { sanityClient } from '@/lib/sanity'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchResult {
  _id: string
  _type: 'post' | 'comment' | 'user'
  title?: string
  text?: string
  username?: string
  content?: string
  subreddit?: {
    name: string
  }
  author?: {
    username: string
  }
  createdAt: string
  commentCount?: number
  upvotes?: any[]
  downvotes?: any[]
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [trendingTopics, setTrendingTopics] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }

    // Load trending topics
    loadTrendingTopics()

    // Close search results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadTrendingTopics = async () => {
    try {
      // Get trending topics from recent posts
      const query = `*[_type == "post"] | order(createdAt desc)[0...10] {
        title,
        content,
        "upvoteCount": count(upvotes),
        "commentCount": count(*[_type == "comment" && post._ref == ^._id])
      }`
      
      const posts = await sanityClient.fetch(query)
      const topics = posts
        .map((post: any) => {
          const text = (post.title + ' ' + (post.content || '')).toLowerCase()
          return text.match(/#\w+/g) || []
        })
        .flat()
        .slice(0, 5)
      
      setTrendingTopics([...new Set(topics)])
    } catch (error) {
      console.error('Error loading trending topics:', error)
    }
  }

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      // Search across posts, comments, and users
      const postQuery = `*[_type == "post" && (title match $query + "*" || content match $query + "*")] | order(createdAt desc)[0...5] {
        _id,
        _type,
        title,
        content,
        createdAt,
        "commentCount": count(*[_type == "comment" && post._ref == ^._id]),
        upvotes,
        downvotes,
        subreddit->{ name },
        author->{ username }
      }`

      const commentQuery = `*[_type == "comment" && text match $query + "*"] | order(createdAt desc)[0...3] {
        _id,
        _type,
        text,
        createdAt,
        author->{ username },
        post->{
          title,
          subreddit->{ name }
        }
      }`

      const userQuery = `*[_type == "user" && username match $query + "*"] | order(createdAt desc)[0...3] {
        _id,
        _type,
        username,
        createdAt
      }`

      const [posts, comments, users] = await Promise.all([
        sanityClient.fetch(postQuery, { query: searchQuery }),
        sanityClient.fetch(commentQuery, { query: searchQuery }),
        sanityClient.fetch(userQuery, { query: searchQuery })
      ])

      const allResults = [
        ...posts.map((post: any) => ({ ...post, title: post.title })),
        ...comments.map((comment: any) => ({ ...comment, text: comment.text })),
        ...users.map((user: any) => ({ ...user, username: user.username }))
      ]

      setResults(allResults)
      setShowResults(true)

      // Save to recent searches
      if (searchQuery.trim()) {
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem('recentSearches', JSON.stringify(updated))
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false)
    setQuery('')

    if (result._type === 'post') {
      router.push(`/r/${result.subreddit?.name || 'all'}/post/${result._id}`)
    } else if (result._type === 'comment') {
      // Navigate to the post containing the comment
      router.push(`/r/${result.post?.subreddit?.name || 'all'}/post/${result.post?._id}`)
    } else if (result._type === 'user') {
      router.push(`/u/${result.username}`)
    }
  }

  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    performSearch(searchTerm)
  }

  const handleTrendingTopic = (topic: string) => {
    setQuery(topic)
    performSearch(topic)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'user':
        return <User className="h-4 w-4 text-green-500" />
      default:
        return <SearchIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getResultTitle = (result: SearchResult) => {
    if (result._type === 'post') {
      return result.title || 'Untitled Post'
    } else if (result._type === 'comment') {
      return result.text?.substring(0, 100) + (result.text && result.text.length > 100 ? '...' : '')
    } else if (result._type === 'user') {
      return `u/${result.username}`
    }
    return 'Unknown'
  }

  const getResultSubtitle = (result: SearchResult) => {
    if (result._type === 'post') {
      return `r/${result.subreddit?.name} • by u/${result.author?.username} • ${result.commentCount} comments`
    } else if (result._type === 'comment') {
      return `Comment by u/${result.author?.username} on "${result.post?.title}"`
    } else if (result._type === 'user') {
      return 'User'
    }
    return ''
  }

  return (
    <div className="relative flex-1 max-w-2xl" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search Reddit..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          className="pl-10 pr-10 py-2 w-full rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('')
              setResults([])
              setShowResults(false)
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div>
              {results.map((result) => (
                <div
                  key={result._id}
                  onClick={() => handleResultClick(result)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getResultIcon(result._type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {getResultTitle(result)}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {getResultSubtitle(result)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Recent Searches
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        onClick={() => handleRecentSearch(search)}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer text-sm text-gray-600"
                      >
                        <Clock className="h-3 w-3" />
                        <span>{search}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Topics */}
              {trendingTopics.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingTopics.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => handleTrendingTopic(topic)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
