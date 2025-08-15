export default {
  name: 'reported',
  title: 'Reported',
  type: 'document',
  fields: [
    {
      name: 'reporter',
      title: 'Reporter',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'post',
      title: 'Reported Post',
      type: 'reference',
      to: [{ type: 'post' }],
    },
    {
      name: 'comment',
      title: 'Reported Comment',
      type: 'reference',
      to: [{ type: 'comment' }],
    },
    {
      name: 'reason',
      title: 'Reason',
      type: 'string',
      options: {
        list: [
          { title: 'Spam', value: 'spam' },
          { title: 'Harassment', value: 'harassment' },
          { title: 'Hate Speech', value: 'hate_speech' },
          { title: 'Violence', value: 'violence' },
          { title: 'Misinformation', value: 'misinformation' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Under Review', value: 'under_review' },
          { title: 'Resolved', value: 'resolved' },
          { title: 'Dismissed', value: 'dismissed' },
        ],
      },
      initialValue: 'pending',
    },
    {
      name: 'moderatorNotes',
      title: 'Moderator Notes',
      type: 'text',
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
      title: 'reason',
      subtitle: 'status',
      media: 'reporter.imageUrl',
    },
  },
}
