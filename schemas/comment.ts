export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'parentComment',
      title: 'Parent Comment',
      type: 'reference',
      to: [{ type: 'comment' }],
    },
    {
      name: 'upvotes',
      title: 'Upvotes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'user' }] }],
    },
    {
      name: 'downvotes',
      title: 'Downvotes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'user' }] }],
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: 'text',
      subtitle: 'author.username',
      media: 'author.imageUrl',
    },
  },
}
