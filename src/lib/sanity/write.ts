// lib/sanity/write.ts
import { createClient } from '@sanity/client'

// Server-only write client (Do NOT import this in a client component.)
export const sanityWrite = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN, // server-only
  useCdn: false,
})
