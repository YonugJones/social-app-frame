'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireViewer } from '@/lib/auth/requireViewer'
import { mustString } from '@/lib/text/mustString'

type CommentState = { ok: true } | { ok: false; error: string }

export async function createComment(
  _prev: CommentState | null,
  formData: FormData,
): Promise<CommentState> {
  const { authUser } = await requireViewer({ requireUsername: true })

  const postId = mustString(formData.get('postId'))
  const content = mustString(formData.get('content')).trim()

  if (!postId) return { ok: false, error: 'Missing postId.' }
  if (!content) return { ok: false, error: 'Content cannot be empty.' }
  if (content.length > 300)
    return { ok: false, error: 'Comment is too long (max 300 characters).' }

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

export async function updateComment(formData: FormData): Promise<CommentState> {
  const { authUser } = await requireViewer({ requireUsername: true })

  const commentId = mustString(formData.get('commentId'))
  const content = mustString(formData.get('content')).trim()
  const path = mustString(formData.get('path')) || '/feed'

  if (!commentId) return { ok: false, error: 'Missing commentId.' }
  if (content.length < 1)
    return { ok: false, error: 'Content cannot be empty.' }
  if (content.length > 300)
    return { ok: false, error: 'Comment is too long (max 300 characters).' }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true },
  })
  if (!comment) return { ok: false, error: 'Comment not found.' }
  if (comment.authorId !== authUser.id)
    return { ok: false, error: 'Not allowed.' }

  await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  })

  revalidatePath(path)
  return { ok: true }
}

export async function deleteComment(formData: FormData): Promise<CommentState> {
  const { authUser } = await requireViewer({ requireUsername: true })

  const commentId = mustString(formData.get('commentId'))
  const path = mustString(formData.get('path')) || '/feed'

  if (!commentId) return { ok: false, error: 'Missing commentId.' }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true },
  })
  if (!comment) return { ok: false, error: 'Comment not found.' }
  if (comment.authorId !== authUser.id)
    return { ok: false, error: 'Not allowed.' }

  await prisma.comment.delete({ where: { id: commentId } })

  revalidatePath(path)
  return { ok: true }
}
