'use client'

import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown, MessageCircle, Reply, MoreHorizontal } from 'lucide-react'
import { formatTimeAgo, formatNumber } from '@/lib/utils'
import { vote, getVoteStatus } from '@/lib/actions'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { sanityClient } from '@/lib/sanity'

interface Comment {
  _id: string
  text: string
  createdAt: string
  author: {
    _id: string
    username: string
    imageUrl?: string
  }
  upvotes: any[]
  downvotes: any[]
  children: Comment[]
  userVote?: number
}

interface CommentsProps {
  postId: string
  onClose: () => void
}

export default function Comments({ postId, onClose }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const query = `*[_type == "comment" && post._ref == $postId && !defined(parentId)] | order(createdAt desc) {
        _id,
        text,
        createdAt,
        author->{
          _id,
          username,
          imageUrl
        },
        upvotes,
        downvotes,
        "children": *[_type == "comment" && parentId._ref == ^._id] | order(createdAt asc) {
          _id,
          text,
          createdAt,
          author->{
            _id,
            username,
            imageUrl
          },
          upvotes,
          downvotes,
          "children": *[_type == "comment" && parentId._ref == ^._id] | order(createdAt asc) {
            _id,
            text,
            createdAt,
            author->{
              _id,
              username,
              imageUrl
            },
            upvotes,
            downvotes
          }
        }
      }`
      
      const result = await sanityClient.fetch(query, { postId })
      
      if (result && result.length > 0) {
        // Fetch user's vote status for each comment if signed in
        if (isSignedIn && user) {
          const commentsWithVotes = await Promise.all(
            result.map(async (comment: Comment) => {
              const voteStatus = await getVoteStatus(undefined, comment._id, user.id)
              const childrenWithVotes = await Promise.all(
                comment.children.map(async (child: Comment) => {
                  const childVoteStatus = await getVoteStatus(undefined, child._id, user.id)
                  const grandChildrenWithVotes = await Promise.all(
                    child.children.map(async (grandChild: Comment) => {
                      const grandChildVoteStatus = await getVoteStatus(undefined, grandChild._id, user.id)
                      return { ...grandChild, userVote: grandChildVoteStatus }
                    })
                  )
                  return { ...child, userVote: childVoteStatus, children: grandChildrenWithVotes }
                })
              )
              return { ...comment, userVote: voteStatus, children: childrenWithVotes }
            })
          )
          setComments(commentsWithVotes)
        } else {
          setComments(result)
        }
      } else {
        setComments([])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      setComments([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (commentId: string, voteType: 'upvote' | 'downvote') => {
    if (!isSignedIn || !user) return

    try {
      const result = await vote(undefined, commentId, voteType)
      
      if (result.success) {
        // Update the comment's vote status optimistically
        setComments(prevComments => 
          updateCommentVotes(prevComments, commentId, voteType, result.action)
        )
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const updateCommentVotes = (
    comments: Comment[],
    commentId: string,
    voteType: 'upvote' | 'downvote',
    action: string
  ): Comment[] => {
    return comments.map(comment => {
      if (comment._id === commentId) {
        const currentVote = comment.userVote || 0
        let newVote = 0
        
        if (action === 'removed') {
          newVote = currentVote === (voteType === 'upvote' ? 1 : -1) ? 0 : currentVote
        } else {
          newVote = voteType === 'upvote' ? 1 : -1
        }
        
        return { ...comment, userVote: newVote }
      }
      
      // Update children recursively
      if (comment.children) {
        return {
          ...comment,
          children: updateCommentVotes(comment.children, commentId, voteType, action)
        }
      }
      
      return comment
    })
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isSignedIn || !user) return

    try {
      // Create comment in Sanity
      const commentDoc = {
        _type: 'comment',
        text: newComment,
        author: {
          _type: 'reference',
          _ref: user.id,
        },
        post: {
          _type: 'reference',
          _ref: postId,
        },
        createdAt: new Date().toISOString(),
      }

      await sanityClient.create(commentDoc)
      setNewComment('')
      fetchComments() // Refresh comments
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyText.trim() || !isSignedIn || !user) return

    try {
      // Create reply in Sanity
      const replyDoc = {
        _type: 'comment',
        text: replyText,
        author: {
          _type: 'reference',
          _ref: user.id,
        },
        post: {
          _type: 'reference',
          _ref: postId,
        },
        parentId: {
          _type: 'reference',
          _ref: parentId,
        },
        createdAt: new Date().toISOString(),
      }

      await sanityClient.create(replyDoc)
      setReplyText('')
      setReplyingTo(null)
      fetchComments() // Refresh comments
    } catch (error) {
      console.error('Error creating reply:', error)
    }
  }

  const renderComment = (comment: Comment, depth: number = 0) => (
    <div key={comment._id} className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="flex space-x-3 py-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.author.imageUrl} />
          <AvatarFallback>{comment.author.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
            <span className="font-medium text-gray-900">u/{comment.author.username}</span>
            <span>•</span>
            <span>{formatTimeAgo(new Date(comment.createdAt))}</span>
          </div>
          
          <p className="text-gray-900 text-sm mb-2">{comment.text}</p>
          
          <div className="flex items-center space-x-4">
            {/* Voting */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment._id, 'upvote')}
                className={`p-1 hover:bg-gray-200 ${
                  comment.userVote === 1 ? 'text-orange-500 bg-orange-50' : 'text-gray-600'
                }`}
                disabled={!isSignedIn}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium text-gray-900 min-w-[1.5rem] text-center">
                {formatNumber((comment.upvotes?.length || 0) - (comment.downvotes?.length || 0))}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment._id, 'downvote')}
                className={`p-1 hover:bg-gray-200 ${
                  comment.userVote === -1 ? 'text-blue-500 bg-blue-50' : 'text-gray-600'
                }`}
                disabled={!isSignedIn}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Reply */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-xs"
            >
              <Reply className="h-3 w-3" />
              <span>Reply</span>
            </Button>

            {/* More options */}
            <Button variant="ghost" size="sm" className="p-1 text-gray-600 hover:text-gray-900">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>

          {/* Reply form */}
          {replyingTo === comment._id && (
            <div className="mt-3">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="mb-2"
                rows={2}
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment._id)}
                  disabled={!replyText.trim()}
                >
                  Reply
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyText('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Render children */}
          {comment.children && comment.children.length > 0 && (
            <div className="mt-3">
              {comment.children.map(child => renderComment(child, depth + 1))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </div>

      {/* New comment form */}
      {isSignedIn && (
        <div className="p-4 border-b border-gray-200">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="mb-3"
            rows={3}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="w-full"
          >
            Comment
          </Button>
        </div>
      )}

      {/* Comments list */}
      <div className="p-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {comments.map(comment => renderComment(comment))}
          </div>
        )}
      </div>
    </div>
  )
}
