import { createClient } from 'next-sanity'

// Server-side Sanity client with direct environment variable access
// Use the new environment variable that contains the full token
const combinedToken = process.env.SANITY_API_TOKEN_PART1 || ''

export const sanityServerClient = createClient({
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  apiVersion: '2024-01-01',
  useCdn: false, // Always false for server-side operations
  token: combinedToken, // Use the full token
})

// Debug logging for server client
console.log('=== SANITY SERVER CLIENT DEBUG ===')
console.log('NEXT_PUBLIC_SANITY_DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET)
console.log('NEXT_PUBLIC_SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
console.log('SANITY_API_TOKEN_PART1 length (server):', process.env.SANITY_API_TOKEN_PART1 ? process.env.SANITY_API_TOKEN_PART1.length : 'undefined')
console.log('Combined token length (server):', combinedToken.length)
console.log('Combined token first 20 chars (server):', combinedToken ? combinedToken.substring(0, 20) + '...' : 'undefined')
console.log('=== END SERVER DEBUG ===')
