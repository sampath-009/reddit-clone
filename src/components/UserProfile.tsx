'use client'

import { useEffect, useState } from 'react'
import { getUserProfile, checkFollowStatus } from '@/lib/actions'
import FollowButton from './FollowButton'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Calendar, Users, FileText } from 'lucide-react'

interface UserProfileProps {
  username: string
}

export default function UserProfile({ username }: UserProfileProps) {
  const [profile, setProfile] = useState<any>(null)
  const [followStatus, setFollowStatus] = useState<any>({ isFollowing: false, isOwnProfile: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [userProfile, followInfo] = await Promise.all([
          getUserProfile(username),
          checkFollowStatus(username)
        ])
        
        setProfile(userProfile)
        setFollowStatus(followInfo)
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [username])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
        <p className="text-gray-600 mt-2">The user you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile.imageUrl} alt={profile.username} />
            <AvatarFallback className="text-2xl font-bold">
              {profile.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
            <p className="text-gray-600">{profile.email}</p>
            {profile.bio && (
              <p className="text-gray-700 mt-2 max-w-md">{profile.bio}</p>
            )}
          </div>
        </div>
        
        <FollowButton
          targetUserId={profile._id}
          isFollowing={followStatus.isFollowing}
          isOwnProfile={followStatus.isOwnProfile}
          className="px-6 py-2"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 py-4 border-t border-gray-200 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{profile.followersCount}</div>
          <div className="text-sm text-gray-500">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{profile.followingCount}</div>
          <div className="text-sm text-gray-500">Following</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{profile.postsCount}</div>
          <div className="text-sm text-gray-500">Posts</div>
        </div>
      </div>

      {/* Following/Followers Preview */}
      {(profile.followingCount > 0 || profile.followersCount > 0) && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-6">
            {profile.followingCount > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Following</h3>
                <p className="text-sm text-gray-600">Following {profile.followingCount} users</p>
              </div>
            )}
            {profile.followersCount > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Followers</h3>
                <p className="text-sm text-gray-600">{profile.followersCount} users following you</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-gray-500 text-sm pt-4 border-t border-gray-200">
        <Calendar className="w-4 h-4" />
        <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
