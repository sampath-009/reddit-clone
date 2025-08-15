'use client'

import { useState, useEffect } from 'react'
import { User, Image, Link, FileText, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// import { createPost } from '@/lib/actions'
import { sanityClient } from '@/lib/sanity'
// import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Subreddit {
  _id: string
  name: string
  description: string
}

export default function CreatePost() {
  const [postType, setPostType] = useState<'text' | 'image' | 'link'>('text')
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [selectedSubreddit, setSelectedSubreddit] = useState('')
  const [communities, setCommunities] = useState<Subreddit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCommunitySelect, setShowCommunitySelect] = useState(false)
  // const { isSignedIn, user } = useUser()
  const isSignedIn = true // Temporary mock for testing
  const user = { imageUrl: undefined } // Temporary mock

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const query = `*[_type == "subreddit"] | order(name asc) {
          _id,
          name,
          description
        }`
        const result = await sanityClient.fetch(query)
        setCommunities(result)
        if (result.length > 0) {
          setSelectedSubreddit(result[0]._id)
        }
      } catch (error) {
        console.error('Error fetching communities:', error)
      }
    }

    if (isSignedIn) {
      fetchCommunities()
    }
  }, [isSignedIn])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !selectedSubreddit) return

    setIsLoading(true)
    try {
      // await createPost(
      //   title.trim(),
      //   content.trim(),
      //   selectedSubreddit,
      //   postType,
      //   postType === 'image' ? content : undefined,
      //   postType === 'link' ? content : undefined
      // )
      console.log('Post creation temporarily disabled - would create:', {
        title: title.trim(),
        content: content.trim(),
        subredditId: selectedSubreddit,
        postType,
        imageUrl: postType === 'image' ? content : undefined,
        linkUrl: postType === 'link' ? content : undefined
      })
      setTitle('')
      setContent('')
      setPostType('text')
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSignedIn) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Create Post"
            className="w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      {/* Post Type Selector */}
      <div className="flex items-center space-x-2 mb-4">
        <Button
          type="button"
          variant={postType === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPostType('text')}
          className="flex items-center space-x-2"
        >
          <FileText className="h-4 w-4" />
          <span>Text</span>
        </Button>
        <Button
          type="button"
          variant={postType === 'image' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPostType('image')}
          className="flex items-center space-x-2"
        >
          <Image className="h-4 w-4" />
          <span>Image</span>
        </Button>
        <Button
          type="button"
          variant={postType === 'link' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPostType('link')}
          className="flex items-center space-x-2"
        >
          <Link className="h-4 w-4" />
          <span>Link</span>
        </Button>
      </div>

      {/* Post Content */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {postType === 'text' && (
          <Textarea
            placeholder="What's on your mind?"
            className="w-full resize-none"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        )}

        {postType === 'image' && (
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              className="w-full resize-none"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Click to upload image</p>
              <p className="text-sm text-gray-500">or drag and drop</p>
            </div>
          </div>
        )}

        {postType === 'link' && (
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              className="w-full resize-none"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Input
              type="url"
              placeholder="https://example.com"
              className="w-full"
            />
          </div>
        )}

        {/* Community Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Post to:</span>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCommunitySelect(!showCommunitySelect)}
                className="flex items-center space-x-1"
              >
                <span>
                  {communities.find(c => c._id === selectedSubreddit)?.name || 'Select Community'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {showCommunitySelect && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {communities.map((community) => (
                    <button
                      key={community._id}
                      type="button"
                      onClick={() => {
                        setSelectedSubreddit(community._id)
                        setShowCommunitySelect(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">r/{community.name}</div>
                      <div className="text-sm text-gray-500">{community.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={!title.trim() || !selectedSubreddit || isLoading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isLoading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  )
}
