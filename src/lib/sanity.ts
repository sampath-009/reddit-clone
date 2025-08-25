import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Use the NEXT_PUBLIC environment variable that the browser can access
const sanityToken = process.env.NEXT_PUBLIC_SANITY_API_TOKEN || ''

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: sanityToken,
}

// Debug logging
console.log('=== SANITY CLIENT DEBUG ===')
console.log('NEXT_PUBLIC_SANITY_DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET)
console.log('NEXT_PUBLIC_SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
console.log('NEXT_PUBLIC_SANITY_API_TOKEN length:', sanityToken.length)
console.log('NEXT_PUBLIC_SANITY_API_TOKEN first 20 chars:', sanityToken ? sanityToken.substring(0, 20) + '...' : 'undefined')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('Config object:', config)
console.log('=== END DEBUG ===')

export const sanityClient = createClient(config)

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}
