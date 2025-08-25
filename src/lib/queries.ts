// Optimized queries for better performance and hydration handling

export const SUBREDDITS_FOR_LIST = `
*[_type=="subreddit"] | order(name asc) {
  _id, 
  name, 
  displayName, 
  description,
  members,
  imageUrl,
  createdAt,
  "memberCount": count(members),
  creator->{
    _id, 
    clerkId, 
    username
  },
  "canDelete": defined($clerkId) && creator->clerkId == $clerkId,
  "isMember": defined($clerkId) && $clerkId in members[]->clerkId
}
`
