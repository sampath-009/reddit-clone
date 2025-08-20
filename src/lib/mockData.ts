export const mockPosts = [
  {
    _id: '1',
    title: 'Just built my first React app! 🚀',
    content: 'After months of learning, I finally built a complete React application. It\'s a simple todo app but I\'m so proud of it!',
    postType: 'text' as const,
    author: {
      _id: 'user1',
      username: 'ReactNewbie',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    subreddit: {
      _id: 'sub1',
      name: 'reactjs'
    },
    upvotes: Array(127).fill('user'),
    downvotes: Array(3).fill('user'),
    commentCount: 23,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    _id: '2',
    title: 'What\'s your favorite programming language and why?',
    content: 'I\'m curious to hear from the community about their preferred languages and the reasoning behind their choices.',
    postType: 'text' as const,
    author: {
      _id: 'user2',
      username: 'CodeExplorer',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    subreddit: {
      _id: 'sub2',
      name: 'programming'
    },
    upvotes: Array(89).fill('user'),
    downvotes: Array(1).fill('user'),
    commentCount: 67,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    _id: '3',
    title: 'Amazing sunset from my balcony tonight',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    postType: 'image' as const,
    author: {
      _id: 'user3',
      username: 'NatureLover',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    subreddit: {
      _id: 'sub3',
      name: 'pics'
    },
    upvotes: Array(256).fill('user'),
    downvotes: Array(5).fill('user'),
    commentCount: 34,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    _id: '4',
    title: 'Check out this amazing article about AI in 2024',
    linkUrl: 'https://example.com/ai-2024',
    postType: 'link' as const,
    author: {
      _id: 'user4',
      username: 'TechEnthusiast',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    subreddit: {
      _id: 'sub4',
      name: 'artificial'
    },
    upvotes: Array(198).fill('user'),
    downvotes: Array(12).fill('user'),
    commentCount: 45,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
  },
  {
    _id: '5',
    title: 'My journey from zero to web developer in 6 months',
    content: 'Started with absolutely no coding knowledge in January. Today I got my first freelance client! Here\'s what I learned...',
    postType: 'text' as const,
    author: {
      _id: 'user5',
      username: 'WebDevJourney',
      imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face'
    },
    subreddit: {
      _id: 'sub5',
      name: 'webdev'
    },
    upvotes: Array(342).fill('user'),
    downvotes: Array(8).fill('user'),
    commentCount: 89,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  }
]

export const getMockPosts = (sortBy: 'home' | 'popular' | 'all') => {
  const posts = [...mockPosts]
  
  switch (sortBy) {
    case 'popular':
      // Sort by engagement (upvotes + comments)
      return posts.sort((a, b) => {
        const aEngagement = a.upvotes.length + a.commentCount
        const bEngagement = b.upvotes.length + b.commentCount
        return bEngagement - aEngagement
      })
    case 'all':
      // Mix of different communities, sorted by newest
      return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    default:
      // Home: Sort by newest first
      return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
}
