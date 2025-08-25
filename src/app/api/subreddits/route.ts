import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'
import { deleteCommunityAction } from '@/app/actions/reddit'

export async function GET() {
  try {
    const query = `*[_type == "subreddit"] | order(name asc) {
      _id,
      name,
      displayName
    }`
    
    const result = await sanityClient.fetch(query)
    
    return NextResponse.json(result || [])
  } catch (error) {
    console.error('Error fetching subreddits:', error)
    return NextResponse.json({ error: 'Failed to fetch subreddits' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { action, subredditId, clerkUserId } = await request.json()
    
    if (action === 'delete' && subredditId && clerkUserId) {
      const result = await deleteCommunityAction({ subredditId, clerkUserId })
      
      if (result.ok) {
        return NextResponse.json({ success: true })
      } else {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 })
      }
    }
    
    return NextResponse.json({ success: false, error: 'Invalid action or missing parameters' }, { status: 400 })
  } catch (error) {
    console.error('Error in subreddits API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
