export type TopicSlug =
  | 'internet-culture'
  | 'technology'
  | 'movies'
  | 'television'
  | 'games'
  | 'books'
  | 'pics'
  | 'music'
  | 'food';

export const TOPICS: Record<TopicSlug, {
  title: string;
  description: string;
  subreddits: string[];   // joined as multi-subreddit
}> = {
  'internet-culture': {
    title: 'Internet Culture',
    description: 'Memes, viral moments, and online trends.',
    subreddits: ['memes','shitposting','AskReddit','OutOfTheLoop']
  },
  technology: {
    title: 'Technology',
    description: 'Latest in tech, gadgets, and science-ish news.',
    subreddits: ['technology','Futurology','gadgets','programming']
  },
  movies: {
    title: 'Movies',
    description: 'Film talk, box office, trailers.',
    subreddits: ['movies','boxoffice','TrueFilm']
  },
  television: {
    title: 'Television',
    description: 'Shows, episodes, and streaming.',
    subreddits: ['television','tvdetails']
  },
  games: {
    title: 'Games',
    description: 'Gaming news, PC/console talk, and esports.',
    subreddits: ['gaming','pcgaming','nintendo','xbox','PlayStation','esports']
  },
  books: {
    title: 'Books',
    description: 'What to read next and book talk.',
    subreddits: ['books','bookclub']
  },
  pics: {
    title: 'Pics',
    description: 'Photography and visual candy.',
    subreddits: ['pics','itookapicture','EarthPorn']
  },
  music: {
    title: 'Music',
    description: 'New releases and music discussion.',
    subreddits: ['Music','listentothis','hiphopheads','indieheads']
  },
  food: {
    title: 'Food',
    description: 'Cooking, recipes, and food pics.',
    subreddits: ['food','Cooking','AskCulinary']
  },
};
