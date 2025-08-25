export async function getPopularSubreddits(limit = 15) {
  const ua = process.env.REDDIT_USER_AGENT || 'reddit-clone/1.0 by sampath'
  
  const res = await fetch(
    `https://www.reddit.com/subreddits/popular.json?limit=${limit}`,
    { 
      headers: { 'User-Agent': ua }, 
      cache: 'no-store' // truly live
    }
  )
  
  if (!res.ok) throw new Error(`Reddit HTTP ${res.status}`)
  
  const json = await res.json() as any
  return json.data.children.map((c: any) => {
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
}

export type Sort = 'hot'|'new'|'top';
export type TopRange = 'hour'|'day'|'week'|'month'|'year'|'all';

export async function getMultiSubredditFeed(
  subs: string[],
  sort: Sort = 'hot',
  limit = 25,
  topRange: TopRange = 'day',
  opts?: { revalidate?: number }
) {
  const multi = subs.join('+');
  const ua = process.env.REDDIT_USER_AGENT || 'reddit-clone/1.0 by sampath';
  const t = sort === 'top' ? `&t=${topRange}` : '';
  const url = `https://www.reddit.com/r/${multi}/${sort}.json?limit=${limit}${t}&raw_json=1`;

  // cache a bit in prod (set to 300s). In dev you can keep no-store.
  const res = await fetch(url, {
    headers: { 'User-Agent': ua },
    next: { revalidate: opts?.revalidate ?? 300 },
  });
  if (!res.ok) throw new Error(`Reddit HTTP ${res.status}`);
  const json = await res.json() as any;

  return json.data.children.map((c: any) => {
    const d = c.data;
    return {
      id: d.id as string,
      title: d.title as string,
      score: d.score as number,
      comments: d.num_comments as number,
      createdUtc: d.created_utc as number,
      subreddit: d.subreddit as string,
      author: d.author as string,
      permalink: `https://reddit.com${d.permalink}`,
      outboundUrl: d.url_overridden_by_dest || d.url || '',
      thumbnail: (d.thumbnail && d.thumbnail.startsWith('http')) ? d.thumbnail : '',
      isVideo: !!d.is_video,
    };
  });
}
