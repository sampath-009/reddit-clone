'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { followUser, unfollowUser } from '@/lib/actions'
import { useRouter } from 'next/navigation'

interface FollowButtonProps {
  targetUserId: string
  isFollowing: boolean
  isOwnProfile: boolean
  className?: string
}

export default function FollowButton({ 
  targetUserId, 
  isFollowing, 
  isOwnProfile, 
  className = '' 
}: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (isOwnProfile) {
    return null
  }

  const handleFollow = async () => {
    if (loading) return
    
    setLoading(true)
    try {
      if (following) {
        await unfollowUser(targetUserId)
        setFollowing(false)
      } else {
        await followUser(targetUserId)
        setFollowing(true)
      }
      router.refresh()
    } catch (error) {
      console.error('Error following/unfollowing user:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      variant={following ? 'outline' : 'default'}
      className={`${className} ${following ? 'border-gray-300 text-gray-700' : ''}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {following ? 'Unfollowing...' : 'Following...'}
        </div>
      ) : (
        following ? 'Unfollow' : 'Follow'
      )}
    </Button>
  )
}
