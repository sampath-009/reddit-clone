// app/actions/sanityHealth.ts
'use server'

import { sanityWrite } from '@/lib/sanity/write'

// This removes all guesswork about truncation/permissions.
export async function sanityHealth() {
  // Debug: Show all available environment variables
  console.log('=== SANITY HEALTH CHECK DEBUG ===')
  console.log('SANITY_API_WRITE_TOKEN length:', (process.env.SANITY_API_WRITE_TOKEN || '').length)
  console.log('SANITY_API_WRITE_TOKEN first 20 chars:', (process.env.SANITY_API_WRITE_TOKEN || '').substring(0, 20))
  console.log('All env vars with SANITY:', Object.keys(process.env).filter(key => key.includes('SANITY')))
  console.log('=== END DEBUG ===')
  
  const len = (process.env.SANITY_API_WRITE_TOKEN || '').length
  
  try {
    // Use a valid schema type - 'post' instead of '__healthcheck'
    const created = await sanityWrite.create({
      _type: 'post',
      title: 'Health Check',
      content: 'Temporary health check post',
      postType: 'text',
      author: {
        _type: 'reference',
        _ref: 'temp-user-id' // This will fail but that's OK for testing permissions
      },
      subreddit: {
        _type: 'reference',
        _ref: 'temp-subreddit-id' // This will fail but that's OK for testing permissions
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    
    // If we get here, the token has write permissions!
    // Clean up by deleting the test post
    await sanityWrite.delete(created._id)
    
    return { ok: true, tokenLen: len, message: 'Token has write permissions!' }
  } catch (e: any) {
    const errorMsg = String(e?.message || e)
    
    // Check if it's a validation error (which means permissions are OK)
    if (errorMsg.includes('Invalid value') || errorMsg.includes('reference')) {
      return { 
        ok: true, 
        tokenLen: len, 
        message: 'Token has write permissions! (Validation errors are expected for test data)',
        error: errorMsg 
      }
    }
    
    // Check if it's a permissions error
    if (errorMsg.includes('permission') || errorMsg.includes('Unauthorized')) {
      return { ok: false, tokenLen: len, error: errorMsg }
    }
    
    return { ok: false, tokenLen: len, error: errorMsg }
  }
}
