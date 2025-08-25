'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Image as ImageIcon, Link as LinkIcon, Type, Hash, ArrowLeft } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createPost } from '@/lib/actions'
import { toast } from 'sonner'
import Header from '@/components/Header'
import AppShell from '@/components/layout/AppShell'
import Sidebar from '@/components/Sidebar'

interface Subreddit {
  _id: string
  name: string
  displayName: string
}

export default function CreatePostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [postType, setPostType] = useState<'text' | 'image' | 'link'>('text')
  const [selectedSubreddit, setSelectedSubreddit] = useState('')
  const [subreddits, setSubreddits] = useState<Subreddit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { isSignedIn, user } = useUser()
  const router = useRouter()

  // Fetch subreddits on component mount
  useEffect(() => {
    fetchSubreddits()
  }, [])

  const fetchSubreddits = async () => {
    try {
      const result = await fetch('/api/subreddits')
      const data = await result.json()
      setSubreddits(data || [])
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
      const postData = {
        title: title.trim(),
        content: postType === 'text' ? content.trim() : '',
        imageUrl: postType === 'image' ? imageUrl.trim() : '',
        linkUrl: postType === 'link' ? linkUrl.trim() : '',
        subredditId: selectedSubreddit,
        postType
      }

      const result = await createPost(postData)
      
      if (result.success) {
        toast.success('Post created successfully!')
        // Reset form
        setTitle('')
        setContent('')
        setImageUrl('')
        setLinkUrl('')
        setSelectedSubreddit('')
        setPostType('text')
        // Redirect to home page
        router.push('/')
      } else {
        toast.error(result.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setImageUrl('')
    setLinkUrl('')
    setSelectedSubreddit('')
    setPostType('text')
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <AppShell right={<Sidebar />}>
          <div className="max-w-2xl mx-auto py-12 text-center">
            <div className="bg-card rounded-lg border border-border p-8">
              <h1 className="text-2xl font-bold text-foreground mb-4">Sign in to create a post</h1>
              <p className="text-muted-foreground mb-6">
                You need to be signed in to create posts and share content with the community.
              </p>
              <Button onClick={() => router.push('/')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go back to home
              </Button>
            </div>
          </div>
        </AppShell>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AppShell right={<Sidebar />}>
        <div className="max-w-2xl mx-auto py-8">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Create a post</h1>
            <p className="text-muted-foreground mt-2">
              Share your thoughts, images, or links with the community
            </p>
          </div>

          {/* Create Post Form */}
          <div className="bg-card rounded-lg border border-border p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Post Type Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Post Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPostType('text')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                      postType === 'text'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
                        : 'border-border hover:border-orange-300'
                    }`}
                  >
                    <Type className="h-4 w-4" />
                    <span className="text-sm font-medium">Text</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPostType('image')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                      postType === 'image'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
                        : 'border-border hover:border-orange-300'
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Image</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPostType('link')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                      postType === 'link'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
                        : 'border-border hover:border-orange-300'
                    }`}
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Link</span>
                  </button>
                </div>
              </div>

              {/* Community Selection */}
              <div>
                <label htmlFor="community" className="block text-sm font-medium text-foreground mb-2">
                  Community
                </label>
                <Select value={selectedSubreddit} onValueChange={setSelectedSubreddit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a community" />
                  </SelectTrigger>
                  <SelectContent>
                    {subreddits.map((subreddit) => (
                      <SelectItem key={subreddit._id} value={subreddit._id}>
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          r/{subreddit.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
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
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {title.length}/300 characters
                </p>
              </div>

              {/* Content based on post type */}
              {postType === 'text' && (
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={6}
                    maxLength={40000}
                    required
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {content.length}/40,000 characters
                  </p>
                </div>
              )}

              {postType === 'image' && (
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-foreground mb-2">
                    Image URL
                  </label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    required
                    className="bg-background"
                  />
                </div>
              )}

              {postType === 'link' && (
                <div>
                  <label htmlFor="linkUrl" className="block text-sm font-medium text-foreground mb-2">
                    Link URL
                  </label>
                  <Input
                    id="linkUrl"
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    className="bg-background"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
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
          </div>
        </div>
      </AppShell>
    </div>
  )
}
