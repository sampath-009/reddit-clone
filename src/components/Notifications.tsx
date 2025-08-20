'use client'

import { useState, useEffect } from 'react'
import { Bell, MessageCircle, TrendingUp, User, X, Check } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { sanityClient } from '@/lib/sanity'
import { Button } from '@/components/ui/button'
import { formatTimeAgo } from '@/lib/utils'

interface Notification {
  _id: string
  type: 'reply' | 'upvote' | 'mention' | 'follow'
  message: string
  createdAt: string
  read: boolean
  postId?: string
  commentId?: string
  userId?: string
  actor: {
    username: string
    imageUrl?: string
  }
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    if (isSignedIn && user) {
      fetchNotifications()
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [isSignedIn, user])

  const fetchNotifications = async () => {
    if (!isSignedIn || !user) return

    try {
      // For now, we'll create mock notifications since we don't have a notification schema
      // In a real app, you'd fetch from a notifications collection
      const mockNotifications: Notification[] = [
        {
          _id: '1',
          type: 'reply',
          message: 'replied to your comment',
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          read: false,
          postId: 'post1',
          commentId: 'comment1',
          actor: {
            username: 'john_doe',
            imageUrl: undefined
          }
        },
        {
          _id: '2',
          type: 'upvote',
          message: 'upvoted your post',
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
          read: false,
          postId: 'post2',
          actor: {
            username: 'jane_smith',
            imageUrl: undefined
          }
        },
        {
          _id: '3',
          type: 'mention',
          message: 'mentioned you in a comment',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          read: true,
          postId: 'post3',
          commentId: 'comment2',
          actor: {
            username: 'bob_wilson',
            imageUrl: undefined
          }
        }
      ]

      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter(n => !n.read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
    setUnreadCount(0)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reply':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'upvote':
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      case 'mention':
        return <User className="h-4 w-4 text-green-500" />
      case 'follow':
        return <User className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationText = (notification: Notification) => {
    const actor = notification.actor.username
    switch (notification.type) {
      case 'reply':
        return `${actor} replied to your comment`
      case 'upvote':
        return `${actor} upvoted your post`
      case 'mention':
        return `${actor} mentioned you in a comment`
      case 'follow':
        return `${actor} started following you`
      default:
        return notification.message
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification._id)
    }
    
    // Navigate to the relevant content
    if (notification.postId) {
      // In a real app, you'd navigate to the post
      console.log('Navigate to post:', notification.postId)
    }
    
    setIsOpen(false)
  }

  if (!isSignedIn) return null

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications yet</p>
                <p className="text-sm">We'll notify you when something happens</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      notification.read 
                        ? 'hover:bg-gray-50' 
                        : 'bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            notification.read ? 'text-gray-900' : 'text-blue-900'
                          }`}>
                            {getNotificationText(notification)}
                          </p>
                          
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification._id)
                              }}
                              className="p-1 h-6 w-6 text-blue-600 hover:text-blue-800"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(new Date(notification.createdAt))}
                          </span>
                          
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
