// Temporary script to delete communities created by the current user
// Run this in your browser console while on localhost:3000

import { deleteCommunityAction } from '@/app/actions/reddit'

// First, let's find the communities you created
const findMyCommunities = async () => {
  try {
    // This will show you the communities and their IDs
    const response = await fetch('/api/subreddits')
    const data = await response.json()
    
    console.log('All communities:', data)
    
    // Filter communities you created (where canDelete is true)
    const myCommunities = data.filter(community => community.canDelete)
    console.log('Communities you created:', myCommunities)
    
    return myCommunities
  } catch (error) {
    console.error('Error fetching communities:', error)
    return []
  }
}

// Delete a specific community
const deleteCommunity = async (communityId) => {
  try {
    // You'll need to get your user ID from Clerk
    const { user } = await import('@clerk/nextjs')
    const clerkUserId = user?.id
    
    if (!clerkUserId) {
      console.error('User not signed in')
      return
    }
    
    const result = await deleteCommunityAction({
      subredditId: communityId,
      clerkUserId: clerkUserId
    })
    
    if (result.ok) {
      console.log('Community deleted successfully!')
    } else {
      console.error('Failed to delete community:', result.error)
    }
  } catch (error) {
    console.error('Error deleting community:', error)
  }
}

// Run this to see your communities
findMyCommunities()
