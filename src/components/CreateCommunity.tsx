'use client'

import { useState } from 'react'
import { Plus, Users, Hash } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { sanityClient } from '@/lib/sanity'
import { toast } from 'sonner'

export default function CreateCommunity() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isSignedIn, user } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isSignedIn || !user) {
      toast.error('You must be signed in to create a community')
      return
    }

    if (!name.trim()) {
      toast.error('Community name is required')
      return
    }

    if (name.length < 3) {
      toast.error('Community name must be at least 3 characters')
      return
    }

    if (name.length > 21) {
      toast.error('Community name must be less than 21 characters')
      return
    }

    // Check if community name already exists
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      toast.error('Community name can only contain letters, numbers, and underscores')
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

      // Check if community name already exists
      const existingCommunity = await sanityClient.fetch(
        `*[_type == "subreddit" && name == $name][0]`,
        { name: name.toLowerCase() }
      )

      if (existingCommunity) {
        toast.error('A community with this name already exists')
        return
      }

      // Create the community
      const community = await sanityClient.create({
        _type: 'subreddit',
        name: name.toLowerCase(),
        displayName: name,
        description: description.trim() || 'A community for sharing and discussing topics.',
        creator: {
          _type: 'reference',
          _ref: sanityUser._id,
        },
        members: [
          {
            _type: 'reference',
            _ref: sanityUser._id,
          }
        ],
        memberCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      toast.success(`Community r/${name} created successfully!`)
      setIsOpen(false)
      setName('')
      setDescription('')
      
      // Refresh the page to show the new community
      window.location.reload()
      
    } catch (error) {
      console.error('Error creating community:', error)
      toast.error('Failed to create community. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-center">
          <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500 text-sm">Sign in to create a community</p>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Community
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Hash className="h-5 w-5 text-orange-500" />
            <span>Create a Community</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Community Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                r/
              </span>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="community_name"
                className="pl-8"
                maxLength={21}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Community names cannot be changed later.
            </p>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is your community about?"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 characters
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? 'Creating...' : 'Create Community'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
