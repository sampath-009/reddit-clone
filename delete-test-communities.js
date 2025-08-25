// Script to delete test communities directly from Sanity
// Run this in your browser console while on localhost:3000

// First, let's see all communities
const seeAllCommunities = async () => {
  try {
    const response = await fetch('/api/subreddits')
    const data = await response.json()
    
    console.log('All communities:', data)
    
    // Find test communities
    const testCommunities = data.filter(community => 
      community.name.includes('test') || 
      community.name.includes('Test') ||
      community.displayName?.includes('Test')
    )
    
    console.log('Test communities found:', testCommunities)
    return testCommunities
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Delete a community by name (since we can't get the ID easily)
const deleteCommunityByName = async (communityName) => {
  try {
    // First get the community ID
    const response = await fetch('/api/subreddits')
    const data = await response.json()
    
    const community = data.find(c => c.name === communityName)
    if (!community) {
      console.error(`Community ${communityName} not found`)
      return
    }
    
    console.log(`Found community: ${community.name} with ID: ${community._id}`)
    
    // Now delete it using the delete action
    const deleteResponse = await fetch('/api/subreddits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete',
        subredditId: community._id
      })
    })
    
    const result = await deleteResponse.json()
    if (result.success) {
      console.log(`✅ Deleted ${communityName}`)
    } else {
      console.error(`❌ Failed to delete ${communityName}:`, result.error)
    }
  } catch (error) {
    console.error('Error deleting community:', error)
  }
}

// Delete both test communities
const deleteAllTestCommunities = async () => {
  const testCommunities = await seeAllCommunities()
  
  for (const community of testCommunities) {
    console.log(`Deleting: ${community.name}`)
    await deleteCommunityByName(community.name)
  }
  
  console.log('Finished deleting test communities')
}

// Run this to delete all test communities
deleteAllTestCommunities()
