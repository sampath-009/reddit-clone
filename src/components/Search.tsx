'use client'

import { useState, useEffect } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import { sanityClient } from '@/lib/sanity'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchResult {
  _id: string
  _type: 'post' | 'subreddit'
  title?: string
  name?: string
  content?: string
  description?: string
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    const searchTimeout = setTimeout(() => {
      performSearch()
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const performSearch = async () => {
    if (query.trim().length < 2) return

    setIsSearching(true)
    try {
      const searchQuery = `{
        "posts": *[_type == "post" && (title match "*${query}*" || content match "*${query}*")] | order(createdAt desc)[0...5] {
          _id,
          _type,
          title,
          content
        },
        "communities": *[_type == "subreddit" && (name match "*${query}*" || description match "*${query}*")] | order(name asc)[0...5] {
          _id,
          _type,
          name,
          description
        }
      }`
      
      const result = await sanityClient.fetch(searchQuery)
      const allResults = [...result.posts, ...result.communities]
      setResults(allResults)
      setShowResults(true)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    if (result._type === 'post') {
      router.push(`/post/${result._id}`)
    } else if (result._type === 'subreddit') {
      router.push(`/r/${result.name}`)
    }
    setShowResults(false)
    setQuery('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch()
    }
  }

  return (
    <div className="relative flex-1 max-w-lg mx-8">
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search Reddit"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          onFocus={() => {
            if (results.length > 0) setShowResults(true)
          }}
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
            <X className="h-3 w-3" />
          </Button>
        )}
      </form>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result._id}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      {result._type === 'post' ? (
                        <span className="text-orange-600 text-xs font-medium">P</span>
                      ) : (
                        <span className="text-orange-600 text-xs font-medium">C</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {result._type === 'post' ? result.title : `r/${result.name}`}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {result._type === 'post' ? result.content : result.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
