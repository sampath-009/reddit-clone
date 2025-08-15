export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
    },
    {
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
    },
    {
      name: 'linkUrl',
      title: 'Link URL',
      type: 'url',
    },
    {
      name: 'postType',
      title: 'Post Type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Image', value: 'image' },
          { title: 'Link', value: 'link' },
        ],
      },
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
      name: 'subreddit',
      title: 'Subreddit',
      type: 'reference',
      to: [{ type: 'subreddit' }],
      validation: (Rule: any) => Rule.required(),
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
      title: 'title',
      subtitle: 'postType',
      media: 'imageUrl',
    },
  },
}
