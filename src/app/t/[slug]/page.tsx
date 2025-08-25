import { notFound } from 'next/navigation'
import { TOPICS, TopicSlug } from '@/lib/topics'
import { getMultiSubredditFeed, type Sort, type TopRange } from '@/lib/reddit'
import Header from '@/components/Header'
import AppShell from '@/components/layout/AppShell'
import Sidebar from '@/components/Sidebar'

export const runtime = 'nodejs'      // ensure Node fetch
export const dynamic = 'force-static'// allow ISR via revalidate in fetch

type Props = { params: { slug: string }, searchParams: { sort?: Sort; t?: TopRange } }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const topic = TOPICS[slug as TopicSlug]
  if (!topic) return {}
  return {
    title: `${topic.title} • Reddit Clone`,
    description: topic.description,
  }
}

export default async function TopicPage({ params, searchParams }: Props) {
  const { slug } = await params
  const topic = TOPICS[slug as TopicSlug]
  if (!topic) return notFound()

  const sort: Sort = (searchParams.sort as Sort) || 'hot'
  const t: TopRange = (searchParams.t as TopRange) || 'day'

  let posts: any[] = []
  let error: string | null = null

  try {
    posts = await getMultiSubredditFeed(topic.subreddits, sort, 25, t, { revalidate: 300 })
  } catch (e) {
    console.error(`Error fetching posts for ${slug}:`, e)
    error = 'Failed to load posts'
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AppShell right={<Sidebar />}>
        <div className="container py-6">
          <header className="mb-5">
            <h1 className="text-2xl font-semibold text-foreground">{topic.title}</h1>
            <p className="text-sm text-muted-foreground">{topic.description}</p>

            {/* sort tabs */}
            <div className="mt-4 flex gap-2 text-sm">
              <Tab href={`/t/${slug}?sort=hot`} active={sort==='hot'}>Hot</Tab>
              <Tab href={`/t/${slug}?sort=new`} active={sort==='new'}>New</Tab>
              <Tab href={`/t/${slug}?sort=top&t=day`} active={sort==='top' && t==='day'}>Top • Day</Tab>
              <Tab href={`/t/${slug}?sort=top&t=week`} active={sort==='top' && t==='week'}>Top • Week</Tab>
            </div>
          </header>

          {error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center text-sm text-destructive">
              {error}
            </div>
          ) : posts.length > 0 ? (
            <ul className="space-y-3">
              {posts.map(p => (
                <li key={p.id} className="rounded-xl border border-border bg-card p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start gap-3">
                    {p.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.thumbnail} alt="" className="mt-0.5 h-14 w-14 rounded object-cover" />
                    ) : (
                      <div className="mt-0.5 h-14 w-14 rounded bg-muted" />
                    )}
                    <div className="min-w-0 flex-1">
                      <a href={p.permalink} target="_blank" rel="noopener noreferrer" className="line-clamp-2 font-medium text-foreground hover:underline">
                        {p.title}
                      </a>
                      <div className="mt-1 text-xs text-muted-foreground">
                        r/{p.subreddit} • by u/{p.author} • {p.score.toLocaleString()} points • {p.comments.toLocaleString()} comments
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No posts right now. Try "New" or another time range.
            </div>
          )}
        </div>
      </AppShell>
    </div>
  )
}

function Tab({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <a href={href}
       className={`rounded-lg px-3 py-1.5 transition-colors ${
         active 
           ? 'bg-orange-500 text-white' 
           : 'border border-border hover:bg-accent text-foreground'
       }`}>
      {children}
    </a>
  )
}
