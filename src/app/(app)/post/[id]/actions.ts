'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type CreateCommentState = { ok: true } | { ok: false; error: string }

export async function createComment(
  _prev: CreateCommentState | null,
  formData: FormData,
): Promise<CreateCommentState> {
  const data = await getServerSession()
  const authUser = data?.user

  if (!authUser) redirect('/login')

  const me = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { username: true },
  })
  if (!me?.username) redirect('/onboarding/username')

  const postId = String(formData.get('postId') ?? '')
  const raw = String(formData.get('content') ?? '')
  const content = raw.trim()

  if (!postId) return { ok: false, error: 'Missing post id' }
  if (!content) return { ok: false, error: 'Content cannot be empty' }
  if (content.length > 300)
    return { ok: false, error: 'Comment is too long (max 300 characters)' }

  await prisma.comment.create({
    data: {
      postId,
      authorId: authUser.id,
      content,
    },
    select: { id: true },
  })

  revalidatePath(`/post/${postId}`)
  revalidatePath('/feed')

  return { ok: true }
}
