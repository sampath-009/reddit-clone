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
