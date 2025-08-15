export default {
  name: 'vote',
  title: 'Vote',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'reference',
      to: [{ type: 'comment' }],
    },
    {
      name: 'voteType',
      title: 'Vote Type',
      type: 'string',
      options: {
        list: [
          { title: 'Upvote', value: 'upvote' },
          { title: 'Downvote', value: 'downvote' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: 'voteType',
      subtitle: 'user.username',
      media: 'user.imageUrl',
    },
  },
}
