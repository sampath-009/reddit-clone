import { sanityClient } from './sanity'
import { auth } from '@clerk/nextjs/server'

export async function getUser() {
  try {
    const { userId } = await auth()
    if (!userId) return null

    const query = `*[_type == "user" && clerkId == $clerkId][0]`
    const result = await sanityClient.fetch(query, { clerkId: userId })
    return result
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function addUser() {
  try {
    console.log('Attempting to add user...')
    
    const { userId } = await auth()
    console.log('Got userId from auth:', userId)
    
    if (!userId) {
      console.log('No userId found from auth')
      return null
    }

    // For now, we'll create a basic user with just the ID
    // In a real app, you might want to get more user details from Clerk
    const userDoc = {
      _type: 'user',
      clerkId: userId,
      username: `user_${userId.slice(0, 8)}`,
      email: `user_${userId.slice(0, 8)}@placeholder.com`,
      imageUrl: '',
      karma: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log('Creating user document:', userDoc)
    console.log('Sanity config:', {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasToken: !!process.env.SANITY_API_TOKEN
    })
    
    const result = await sanityClient.create(userDoc)
    console.log('Successfully created user:', result._id)
    return result
  } catch (error) {
    console.error('Error adding user:', error)
    
    // Log more details about the error
    if (error.response) {
      console.error('Error response:', error.response)
      console.error('Error status:', error.response.statusCode)
      console.error('Error body:', error.response.responseBody)
    }
    
    return null
  }
}

export async function getOrCreateUser() {
  try {
    console.log('Attempting to get or create user...')
    
    // First try to get existing user
    const existingUser = await getUser()
    if (existingUser) {
      console.log('Found existing user:', existingUser._id)
      return existingUser
    }

    console.log('No existing user found, creating new user...')
    
    // Test Sanity connection first
    try {
      console.log('Testing Sanity connection...')
      const testQuery = `*[_type == "user"][0...1]`
      const testResult = await sanityClient.fetch(testQuery)
      console.log('Sanity read test successful:', testResult)
    } catch (testError) {
      console.error('Sanity read test failed:', testError)
      return null
    }
    
    // If no existing user, create one
    const newUser = await addUser()
    if (newUser) {
      console.log('Successfully created new user:', newUser._id)
      return newUser
    }

    console.log('Failed to create new user')
    return null
  } catch (error) {
    console.error('Error in getOrCreateUser:', error)
    return null
  }
}
