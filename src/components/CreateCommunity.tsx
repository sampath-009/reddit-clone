'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// import { createCommunity } from '@/lib/actions'
// import { useUser } from '@clerk/nextjs'

export default function CreateCommunity() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // const { isSignedIn } = useUser()
  const isSignedIn = true // Temporary mock for testing

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !description.trim()) return

    setIsLoading(true)
    try {
      // await createCommunity(name.trim(), description.trim())
      console.log('Community creation temporarily disabled - would create:', {
        name: name.trim(),
        description: description.trim()
      })
      setName('')
      setDescription('')
      setIsOpen(false)
    } catch (error) {
      console.error('Error creating community:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSignedIn) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Community</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Community Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter community name"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your community"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Community'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
