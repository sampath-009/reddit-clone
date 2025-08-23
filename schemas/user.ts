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
      name: 'following',
      title: 'Following',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'user' }] }],
      description: 'Users this user is following',
    },
    {
      name: 'followers',
      title: 'Followers',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'user' }] }],
      description: 'Users following this user',
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      description: 'User bio/description',
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
