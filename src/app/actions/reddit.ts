'use server'

import { sanityWrite } from '@/lib/sanity/write'
import { revalidatePath } from 'next/cache'

/** Delete a post (author-only). Also removes its comments. */
export async function deletePostAction({
  postId,
  clerkUserId,
}: { postId: string; clerkUserId: string }) {
  try {
    const post = await sanityWrite.fetch(
      `*[_type=="post" && _id==$id][0]{_id, author->{clerkId}}`,
      { id: postId }
    )
    if (!post) return { ok: false, error: 'Post not found' }
    if (post.author?.clerkId !== clerkUserId)
      return { ok: false, error: 'Only the author can delete this post' }

    const commentIds: string[] = await sanityWrite.fetch(
      `*[_type=="comment" && post._ref==$id][]._id`,
      { id: postId }
    )

    const tx = sanityWrite.transaction()
    for (const cid of commentIds) tx.delete(cid)
    tx.delete(postId)
    await tx.commit()

    revalidatePath('/')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) }
  }
}

/** Delete a community (creator-only). Cascades posts + comments. */
export async function deleteCommunityAction({
  subredditId,
  clerkUserId,
}: { subredditId: string; clerkUserId: string }) {
  try {
    // Verify creator ownership
    const sub = await sanityWrite.fetch(
      `*[_type=="subreddit" && _id==$id][0]{_id, name, creator->{clerkId}}`,
      { id: subredditId }
    )
    if (!sub) return { ok: false, error: 'Community not found' }
    if (sub.creator?.clerkId !== clerkUserId)
      return { ok: false, error: 'Only the creator can delete this community' }

    // Gather children
    const postIds: string[] = await sanityWrite.fetch(
      `*[_type=="post" && subreddit._ref==$id][]._id`, { id: subredditId }
    )
    const commentIds: string[] = postIds.length
      ? await sanityWrite.fetch(
          `*[_type=="comment" && post._ref in $p][]._id`, { p: postIds }
        )
      : []

    // Batch delete in chunks (avoid >100 mutations per tx)
    const chunks = <T,>(arr: T[], n = 80) =>
      Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))

    for (const ids of chunks([...commentIds, ...postIds, subredditId], 80)) {
      let tx = sanityWrite.transaction()
      ids.forEach(id => tx = tx.delete(id))
      await tx.commit()
    }

    revalidatePath('/')
    revalidatePath('/r/[slug]', 'page')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) }
  }
}

/** Leave a community (remove user from members array) */
export async function leaveCommunityAction({
  subredditId,
  clerkUserId,
}: { subredditId: string; clerkUserId: string }) {
  try {
    // Get the community and check if user is a member
    const sub = await sanityWrite.fetch(
      `*[_type=="subreddit" && _id==$id][0]{
        _id, 
        name, 
        members[]->{_id, clerkId}
      }`,
      { id: subredditId }
    )
    
    if (!sub) return { ok: false, error: 'Community not found' }
    
    // Find the user's member reference
    const userMemberRef = sub.members?.find((member: any) => member.clerkId === clerkUserId)
    if (!userMemberRef) return { ok: false, error: 'You are not a member of this community' }

    // Remove user from members array
    await sanityWrite
      .patch(subredditId)
      .setIfMissing({ members: [] })
      .unset([`members[_ref=="${userMemberRef._id}"]`])
      .commit()

    revalidatePath('/')
    revalidatePath('/r/[slug]', 'page')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) }
  }
}

/** Join a community (add user to members array) */
export async function joinCommunityAction({
  subredditId,
  clerkUserId,
}: { subredditId: string; clerkUserId: string }) {
  try {
    // Get the community and check if user is already a member
    const sub = await sanityWrite.fetch(
      `*[_type=="subreddit" && _id==$id][0]{
        _id, 
        name, 
        members[]->{_id, clerkId}
      }`,
      { id: subredditId }
    )
    
    if (!sub) return { ok: false, error: 'Community not found' }
    
    // Check if user is already a member
    const isAlreadyMember = sub.members?.some((member: any) => member.clerkId === clerkUserId)
    if (isAlreadyMember) return { ok: false, error: 'You are already a member of this community' }

    // Get the user document reference
    const userDoc = await sanityWrite.fetch(
      `*[_type=="user" && clerkId==$clerkId][0]{_id}`,
      { clerkId: clerkUserId }
    )
    
    if (!userDoc) return { ok: false, error: 'User not found' }

    // Add user to members array
    await sanityWrite
      .patch(subredditId)
      .setIfMissing({ members: [] })
      .append('members', [{ _type: 'reference', _ref: userDoc._id }])
      .commit()

    revalidatePath('/')
    revalidatePath('/r/[slug]', 'page')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) }
  }
}
