export default {
  name: 'subreddit',
  title: 'Subreddit',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'creator',
      title: 'Creator',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'members',
      title: 'Members',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'user' }] }],
    },
    {
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
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
      title: 'name',
      subtitle: 'description',
      media: 'imageUrl',
    },
  },
}
