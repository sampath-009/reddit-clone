'use client'

import { useState, useEffect } from 'react'
import { Plus, Image as ImageIcon, Link as LinkIcon, Type, Hash } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { sanityClient } from '@/lib/sanity'
import { toast } from 'sonner'

interface Subreddit {
  _id: string
  name: string
  displayName: string
}

export default function CreatePost({ preSelectedCommunity }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [postType, setPostType] = useState<'text' | 'image' | 'link'>('text')
  const [selectedSubreddit, setSelectedSubreddit] = useState('')
  const [subreddits, setSubreddits] = useState<Subreddit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    if (isOpen) {
      fetchSubreddits()
    }
  }, [isOpen])

  useEffect(() => {
    if (preSelectedCommunity) {
      setSelectedSubreddit(preSelectedCommunity)
    }
  }, [preSelectedCommunity])

  const fetchSubreddits = async () => {
    try {
      const query = `*[_type == "subreddit"] | order(name asc) {
        _id,
        name,
        displayName
      }`
      const result = await sanityClient.fetch(query)
      setSubreddits(result || [])
    } catch (error) {
      console.error('Error fetching subreddits:', error)
      toast.error('Failed to load communities')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isSignedIn || !user) {
      toast.error('You must be signed in to create a post')
      return
    }

    if (!title.trim()) {
      toast.error('Post title is required')
      return
    }

    if (!selectedSubreddit) {
      toast.error('Please select a community')
      return
    }

    // Validate content based on post type
    if (postType === 'text' && !content.trim()) {
      toast.error('Text content is required for text posts')
      return
    }

    if (postType === 'image' && !imageUrl.trim()) {
      toast.error('Image URL is required for image posts')
      return
    }

    if (postType === 'link' && !linkUrl.trim()) {
      toast.error('Link URL is required for link posts')
      return
    }

    setIsLoading(true)

    try {
      // First, get or create the user in Sanity
      const existingUser = await sanityClient.fetch(
        `*[_type == "user" && clerkId == $clerkId][0]`,
        { clerkId: user.id }
      )

      let sanityUser
      if (existingUser) {
        sanityUser = existingUser
      } else {
        // Create new user in Sanity
        sanityUser = await sanityClient.create({
          _type: 'user',
          clerkId: user.id,
          username: user.username || `user_${user.id.slice(0, 8)}`,
          email: user.emailAddresses[0]?.emailAddress || '',
          imageUrl: user.imageUrl,
          karma: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      // Create the post
      const post = await sanityClient.create({
        _type: 'post',
        title: title.trim(),
        content: postType === 'text' ? content.trim() : undefined,
        imageUrl: postType === 'image' ? imageUrl.trim() : undefined,
        linkUrl: postType === 'link' ? linkUrl.trim() : undefined,
        postType,
        author: {
          _type: 'reference',
          _ref: sanityUser._id,
        },
        subreddit: {
          _type: 'reference',
          _ref: selectedSubreddit,
        },
        upvotes: [],
        downvotes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      toast.success('Post created successfully!')
      setIsOpen(false)
      
      // Reset form
      setTitle('')
      setContent('')
      setImageUrl('')
      setLinkUrl('')
      setPostType('text')
      setSelectedSubreddit('')
      
      // Refresh the page to show the new post
      window.location.reload()
      
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setImageUrl('')
    setLinkUrl('')
    setPostType('text')
    setSelectedSubreddit('')
  }

  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-center">
          <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500 text-sm">Sign in to create a post</p>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-orange-500" />
            <span>Create a Post</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Community Selection */}
          <div>
            <label htmlFor="subreddit" className="block text-sm font-medium text-gray-700 mb-1">
              Community
            </label>
            <Select value={selectedSubreddit} onValueChange={setSelectedSubreddit}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a community" />
              </SelectTrigger>
              <SelectContent>
                {subreddits.map((subreddit) => (
                  <SelectItem key={subreddit._id} value={subreddit._id}>
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-orange-500" />
                      <span>r/{subreddit.displayName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Post Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Type
            </label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={postType === 'text' ? 'default' : 'outline'}
                onClick={() => setPostType('text')}
                className="flex-1"
              >
                <Type className="h-4 w-4 mr-2" />
                Text
              </Button>
              <Button
                type="button"
                variant={postType === 'image' ? 'default' : 'outline'}
                onClick={() => setPostType('image')}
                className="flex-1"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Image
              </Button>
              <Button
                type="button"
                variant={postType === 'link' ? 'default' : 'outline'}
                onClick={() => setPostType('link')}
                className="flex-1"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Link
              </Button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={300}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/300 characters
            </p>
          </div>

          {/* Content based on post type */}
          {postType === 'text' && (
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                maxLength={40000}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {content.length}/40,000 characters
              </p>
            </div>
          )}

          {postType === 'image' && (
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
          )}

          {postType === 'link' && (
            <div>
              <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Link URL
              </label>
              <Input
                id="linkUrl"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false)
                resetForm()
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim() || !selectedSubreddit}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
