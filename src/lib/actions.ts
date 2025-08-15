'use server'

import { sanityClient } from './sanity'
import { getOrCreateUser } from './helpers'
import { revalidatePath } from 'next/cache'

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
  postId?: string,
  commentId?: string,
  voteType: 'upvote' | 'downvote'
) {
  try {
    const user = await getOrCreateUser()
    if (!user) throw new Error('User not found')

    if (!postId && !commentId) throw new Error('Post or comment ID required')

    const voteDoc = {
      _type: 'vote',
      user: {
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
      voteType,
      createdAt: new Date().toISOString(),
    }

    const result = await sanityClient.create(voteDoc)
    revalidatePath('/')
    return result
  } catch (error) {
    console.error('Error voting:', error)
    throw error
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
