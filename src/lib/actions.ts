'use server'

import { sanityClient } from './sanity'
import { getOrCreateUser } from './helpers'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

export async function createCommunity(name: string, description: string) {
  try {
    const user = await getOrCreateUser()
    if (!user) throw new Error('User not found')

    const communityDoc = {
      _type: 'subreddit',
      name: name.toLowerCase(),
      description,
      creator: {
        _type: 'reference',
        _ref: user._id,
      },
      members: [
        {
          _type: 'reference',
          _ref: user._id,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await sanityClient.create(communityDoc)
    revalidatePath('/')
    return result
  } catch (error) {
    console.error('Error creating community:', error)
    throw error
  }
}

export async function createPost(
  title: string,
  content: string,
  subredditId: string,
  postType: 'text' | 'image' | 'link',
  imageUrl?: string,
  linkUrl?: string
) {
  try {
    const user = await getOrCreateUser()
    if (!user) throw new Error('User not found')

    const postDoc = {
      _type: 'post',
      title,
      content,
      postType,
      imageUrl,
      linkUrl,
      author: {
        _type: 'reference',
        _ref: user._id,
      },
      subreddit: {
        _type: 'reference',
        _ref: subredditId,
      },
      upvotes: [],
      downvotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await sanityClient.create(postDoc)
    revalidatePath('/')
    return result
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export async function createComment(
  text: string,
  postId: string,
  parentCommentId?: string
) {
  try {
    const user = await getOrCreateUser()
    if (!user) throw new Error('User not found')

    const commentDoc = {
      _type: 'comment',
      text,
      author: {
        _type: 'reference',
        _ref: user._id,
      },
      post: {
        _type: 'reference',
        _ref: postId,
      },
      parentComment: parentCommentId
        ? {
            _type: 'reference',
            _ref: parentCommentId,
          }
        : undefined,
      upvotes: [],
      downvotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await sanityClient.create(commentDoc)
    revalidatePath('/')
    return result
  } catch (error) {
    console.error('Error creating comment:', error)
    throw error
  }
}

export async function vote(
  postId: string | undefined,
  commentId: string | undefined,
  voteType: 'upvote' | 'downvote'
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const user = await getOrCreateUser()
    if (!user) {
      throw new Error('User not found')
    }

    if (postId) {
      // Handle post voting
      const post = await sanityClient.getDocument(postId)
      if (!post) {
        throw new Error('Post not found')
      }

      const upvotes = post.upvotes || []
      const downvotes = post.downvotes || []
      const userVoteIndex = upvotes.findIndex((vote: any) => vote._ref === user._id)
      const userDownvoteIndex = downvotes.findIndex((vote: any) => vote._ref === user._id)

      if (voteType === 'upvote') {
        if (userVoteIndex !== -1) {
          // Remove upvote
          upvotes.splice(userVoteIndex, 1)
          return { success: true, action: 'removed' }
        } else {
          // Add upvote, remove downvote if exists
          if (userDownvoteIndex !== -1) {
            downvotes.splice(userDownvoteIndex, 1)
          }
          upvotes.push({ _type: 'reference', _ref: user._id })
          return { success: true, action: 'updated' }
        }
      } else {
        if (userDownvoteIndex !== -1) {
          // Remove downvote
          downvotes.splice(userDownvoteIndex, 1)
          return { success: true, action: 'removed' }
        } else {
          // Add downvote, remove upvote if exists
          if (userVoteIndex !== -1) {
            upvotes.splice(userVoteIndex, 1)
          }
          downvotes.push({ _type: 'reference', _ref: user._id })
          return { success: true, action: 'updated' }
        }
      }

      // Update the post
      await sanityClient.patch(postId).set({
        upvotes,
        downvotes
      }).commit()
    }

    if (commentId) {
      // Handle comment voting (similar logic)
      const comment = await sanityClient.getDocument(commentId)
      if (!comment) {
        throw new Error('Comment not found')
      }

      const upvotes = comment.upvotes || []
      const downvotes = comment.downvotes || []
      const userVoteIndex = upvotes.findIndex((vote: any) => vote._ref === user._id)
      const userDownvoteIndex = downvotes.findIndex((vote: any) => vote._ref === user._id)

      if (voteType === 'upvote') {
        if (userVoteIndex !== -1) {
          upvotes.splice(userVoteIndex, 1)
          return { success: true, action: 'removed' }
        } else {
          if (userDownvoteIndex !== -1) {
            downvotes.splice(userDownvoteIndex, 1)
          }
          upvotes.push({ _type: 'reference', _ref: user._id })
          return { success: true, action: 'updated' }
        }
      } else {
        if (userDownvoteIndex !== -1) {
          downvotes.splice(userDownvoteIndex, 1)
          return { success: true, action: 'removed' }
        } else {
          if (userVoteIndex !== -1) {
            upvotes.splice(userVoteIndex, 1)
          }
          downvotes.push({ _type: 'reference', _ref: user._id })
          return { success: true, action: 'updated' }
        }
      }

      // Update the comment
      await sanityClient.patch(commentId).set({
        upvotes,
        downvotes
      }).commit()
    }

    return { success: true, action: 'created' }
  } catch (error) {
    console.error('Error voting:', error)
    return { success: false, error: 'Failed to vote' }
  }
}

export async function getVoteStatus(
  postId: string | undefined,
  commentId: string | undefined,
  userId: string
) {
  try {
    const user = await getOrCreateUser()
    if (!user) return 0

    if (postId) {
      const post = await sanityClient.getDocument(postId)
      if (!post) return 0

      const upvotes = post.upvotes || []
      const downvotes = post.downvotes || []
      
      if (upvotes.find((vote: any) => vote._ref === user._id)) {
        return 1
      } else if (downvotes.find((vote: any) => vote._ref === user._id)) {
        return -1
      }
    }

    if (commentId) {
      const comment = await sanityClient.getDocument(commentId)
      if (!comment) return 0

      const upvotes = comment.upvotes || []
      const downvotes = comment.downvotes || []
      
      if (upvotes.find((vote: any) => vote._ref === user._id)) {
        return 1
      } else if (downvotes.find((vote: any) => vote._ref === user._id)) {
        return -1
      }
    }

    return 0
  } catch (error) {
    console.error('Error getting vote status:', error)
    return 0
  }
}

export async function getVoteCounts(
  postId: string | undefined,
  commentId: string | undefined
) {
  try {
    if (postId) {
      const post = await sanityClient.getDocument(postId)
      if (!post) return { upvotes: 0, downvotes: 0, total: 0 }

      const upvotes = post.upvotes?.length || 0
      const downvotes = post.downvotes?.length || 0
      return { upvotes, downvotes, total: upvotes - downvotes }
    }

    if (commentId) {
      const comment = await sanityClient.getDocument(commentId)
      if (!comment) return { upvotes: 0, downvotes: 0, total: 0 }

      const upvotes = comment.upvotes?.length || 0
      const downvotes = comment.downvotes?.length || 0
      return { upvotes, downvotes, total: upvotes - downvotes }
    }

    return { upvotes: 0, downvotes: 0, total: 0 }
  } catch (error) {
    console.error('Error getting vote counts:', error)
    return { upvotes: 0, downvotes: 0, total: 0 }
  }
}

export async function reportContent(
  postId?: string,
  commentId?: string,
  reason: string,
  description?: string
) {
  try {
    const user = await getOrCreateUser()
    if (!user) throw new Error('User not found')

    if (!postId && !commentId) throw new Error('Post or comment ID required')

    const reportDoc = {
      _type: 'reported',
      reporter: {
        _type: 'reference',
        _ref: user._id,
      },
      post: postId
        ? {
            _type: 'reference',
            _ref: postId,
          }
        : undefined,
      comment: commentId
        ? {
            _type: 'reference',
            _ref: commentId,
          }
        : undefined,
      reason,
      description,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await sanityClient.create(reportDoc)
    revalidatePath('/')
    return result
  } catch (error) {
    console.error('Error reporting content:', error)
    throw error
  }
}

export async function followUser(userIdToFollow: string) {
  try {
    const user = await getOrCreateUser()
    if (!user) throw new Error('User not found')
    
    if (user._id === userIdToFollow) {
      throw new Error('Cannot follow yourself')
    }

    // Get current user's following list
    const currentUser = await sanityClient.getDocument(user._id)
    const following = currentUser.following || []
    
    // Check if already following
    const isAlreadyFollowing = following.find((followedUser: any) => followedUser._ref === userIdToFollow)
    if (isAlreadyFollowing) {
      throw new Error('Already following this user')
    }

    // Add to following list
    following.push({ _type: 'reference', _ref: userIdToFollow })
    
    // Update current user
    await sanityClient.patch(user._id).set({
      following,
      updatedAt: new Date().toISOString()
    }).commit()

    // Update target user's followers list
    const targetUser = await sanityClient.getDocument(userIdToFollow)
    const followers = targetUser.followers || []
    followers.push({ _type: 'reference', _ref: user._id })
    
    await sanityClient.patch(userIdToFollow).set({
      followers,
      updatedAt: new Date().toISOString()
    }).commit()

    revalidatePath('/')
    revalidatePath(`/u/${currentUser.username}`)
    revalidatePath(`/u/${targetUser.username}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error following user:', error)
    throw error
  }
}

export async function unfollowUser(userIdToUnfollow: string) {
  try {
    const user = await getOrCreateUser()
    if (!user) throw new Error('User not found')

    // Get current user's following list
    const currentUser = await sanityClient.getDocument(user._id)
    const following = currentUser.following || []
    
    // Remove from following list
    const updatedFollowing = following.filter((followedUser: any) => followedUser._ref !== userIdToUnfollow)
    
    // Update current user
    await sanityClient.patch(user._id).set({
      following: updatedFollowing,
      updatedAt: new Date().toISOString()
    }).commit()

    // Update target user's followers list
    const targetUser = await sanityClient.getDocument(userIdToUnfollow)
    const followers = targetUser.followers || []
    const updatedFollowers = followers.filter((follower: any) => follower._ref !== user._id)
    
    await sanityClient.patch(userIdToUnfollow).set({
      followers: updatedFollowers,
      updatedAt: new Date().toISOString()
    }).commit()

    revalidatePath('/')
    revalidatePath(`/u/${currentUser.username}`)
    revalidatePath(`/u/${targetUser.username}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error unfollowing user:', error)
    throw error
  }
}

export async function getFollowedUsersPosts() {
  try {
    const user = await getOrCreateUser()
    if (!user) throw new Error('User not found')

    // Get current user's following list
    const currentUser = await sanityClient.getDocument(user._id)
    const following = currentUser.following || []
    
    if (following.length === 0) {
      return []
    }

    // Get posts from followed users
    const followedUserIds = following.map((followedUser: any) => followedUser._ref)
    
    const posts = await sanityClient.fetch(`
      *[_type == "post" && author._ref in $followedUserIds] | order(createdAt desc) {
        _id,
        title,
        content,
        postType,
        imageUrl,
        linkUrl,
        createdAt,
        "author": {
          _id: author._ref,
          username: author->username,
          imageUrl: author->imageUrl
        },
        "subreddit": {
          _id: subreddit._ref,
          name: subreddit->name
        },
        "upvotes": upvotes[]->._id,
        "downvotes": downvotes[]->._id
      }
    `, { followedUserIds })

    return posts
  } catch (error) {
    console.error('Error getting followed users posts:', error)
    return []
  }
}

export async function checkFollowStatus(targetUserId: string) {
  try {
    const user = await getOrCreateUser()
    if (!user) return { isFollowing: false, isOwnProfile: false }

    if (user._id === targetUserId) {
      return { isFollowing: false, isOwnProfile: true }
    }

    const currentUser = await sanityClient.getDocument(user._id)
    const following = currentUser.following || []
    
    const isFollowing = following.find((followedUser: any) => followedUser._ref === targetUserId)
    
    return { isFollowing: !!isFollowing, isOwnProfile: false }
  } catch (error) {
    console.error('Error checking follow status:', error)
    return { isFollowing: false, isOwnProfile: false }
  }
}

export async function getUserProfile(username: string) {
  try {
    const user = await sanityClient.fetch(`
      *[_type == "user" && username == $username][0] {
        _id,
        username,
        email,
        imageUrl,
        karma,
        bio,
        createdAt,
        "followersCount": count(followers),
        "followingCount": count(following),
        "postsCount": count(*[_type == "post" && author._ref == ^._id])
      }
    `, { username })

    return user
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}
