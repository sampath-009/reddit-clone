export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'clerkId',
      title: 'Clerk ID',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'username',
      title: 'Username',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
    },
    {
      name: 'karma',
      title: 'Karma',
      type: 'number',
      initialValue: 0,
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
      title: 'username',
      subtitle: 'email',
      media: 'imageUrl',
    },
  },
}
