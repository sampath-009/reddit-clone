'use client'

import { sanityHealth } from '@/app/actions/sanityHealth'

// Temporarily call it from a client button:
export default function DebugBtn() {
  return (
    <button
      onClick={async () => {
        alert(JSON.stringify(await sanityHealth(), null, 2))
      }}
    >
      Sanity Health
    </button>
  )
}
