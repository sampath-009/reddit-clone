export const runtime = 'nodejs' // Reddit requires Node fetch with custom UA

type RedditListing = {
  data: { children: Array<{ data: any }> }
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 reddit-clone/1.0'

export async function GET() {
  try {
    console.log('🔍 Fetching popular subreddits from Reddit...')
    
    // Add a small delay to be respectful to Reddit's API
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const res = await fetch('https://www.reddit.com/subreddits/popular.json?limit=20', {
      headers: { 
        'User-Agent': UA,
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      cache: 'no-store', // truly live
    })
    
    console.log('📡 Reddit response status:', res.status)
    
    if (!res.ok) {
      console.error('❌ Reddit API error:', res.status, res.statusText)
      
      // If we get rate limited, return some popular subreddits as fallback
      if (res.status === 429) {
        console.log('🔄 Rate limited, returning fallback data...')
        const fallbackData = [
          {
            name: 'askreddit',
            title: 'Ask Reddit',
            subscribers: 45000000,
            icon: '',
            description: 'r/AskReddit is the place to ask and answer thought-provoking questions.',
            url: 'https://reddit.com/r/askreddit'
          },
          {
            name: 'funny',
            title: 'funny',
            subscribers: 42000000,
            icon: '',
            description: 'Welcome to r/funny!',
            url: 'https://reddit.com/r/funny'
          },
          {
            name: 'gaming',
            title: 'Gaming',
            subscribers: 38000000,
            icon: '',
            description: 'A subreddit for (almost) anything related to games.',
            url: 'https://reddit.com/r/gaming'
          },
          {
            name: 'pics',
            title: 'pics',
            subscribers: 30000000,
            icon: '',
            description: 'A place to share interesting photographs and pictures.',
            url: 'https://reddit.com/r/pics'
          },
          {
            name: 'science',
            title: 'science',
            subscribers: 32000000,
            icon: '',
            description: 'This community is for intelligent discussions about science.',
            url: 'https://reddit.com/r/science'
          }
        ]
        return Response.json({ ok: true, items: fallbackData, fallback: true })
      }
      
      return Response.json({ ok: false, error: `HTTP ${res.status}: ${res.statusText}` }, { status: 500 })
    }
    
    const json = (await res.json()) as RedditListing
    console.log('✅ Reddit data received, processing...')
    
    const items = json.data.children.map(c => {
      const d = c.data
      return {
        name: String(d.display_name).toLowerCase(),
        title: d.title as string,
        subscribers: d.subscribers as number,
        icon: d.community_icon?.split('?')[0] || d.icon_img || '',
        description: d.public_description || '',
        url: `https://reddit.com${d.url}`,
      }
    })
    
    console.log(`🎉 Processed ${items.length} popular subreddits`)
    return Response.json({ ok: true, items })
    
  } catch (e: any) {
    console.error('💥 Error fetching from Reddit:', e)
    return Response.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}
