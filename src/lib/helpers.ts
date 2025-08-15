import { sanityClient } from './sanity'
import { currentUser } from '@clerk/nextjs'

export async function getUser() {
  try {
    const user = await currentUser()
    if (!user) return null

    const query = `*[_type == "user" && clerkId == $clerkId][0]`
    const result = await sanityClient.fetch(query, { clerkId: user.id })
    return result
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function addUser() {
  try {
    const user = await currentUser()
    if (!user) return null

    const userDoc = {
      _type: 'user',
      clerkId: user.id,
      username: user.username || user.firstName || 'Anonymous',
      email: user.emailAddresses[0]?.emailAddress || '',
      imageUrl: user.imageUrl,
      karma: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await sanityClient.create(userDoc)
    return result
  } catch (error) {
    console.error('Error adding user:', error)
    return null
  }
}

export async function getOrCreateUser() {
  try {
    const existingUser = await getUser()
    if (existingUser) return existingUser

    return await addUser()
  } catch (error) {
    console.error('Error getting or creating user:', error)
    return null
  }
}
