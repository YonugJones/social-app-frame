'use server'

import prisma from '@/lib/prisma'
import { requireViewer } from '@/lib/auth/requireViewer'
import { revalidatePath } from 'next/cache'
import { mustString } from '@/lib/text/mustString'

type PostState = { ok: true } | { ok: false; error: string }

export async function createPost(
  _prev: PostState | null,
  formData: FormData,
): Promise<PostState> {
  const { authUser } = await requireViewer({ requireUsername: true })

  const content = mustString(formData.get('content')).trim()
  if (!content) return { ok: false, error: 'Post cannot be empty.' }
  if (content.length > 500)
    return { ok: false, error: 'Post cannot exceed 500 characters.' }

  await prisma.post.create({
    data: {
      content,
      authorId: authUser.id,
    },
    select: { id: true },
  })

  revalidatePath('/feed')
  return { ok: true }
}

export async function updatePost(formData: FormData): Promise<PostState> {
  const { authUser } = await requireViewer({ requireUsername: true })

  const postId = mustString(formData.get('postId'))
  const content = mustString(formData.get('content')).trim()
  const path = mustString(formData.get('path')) || '/feed'

  if (!postId) return { ok: false, error: 'Missing postId.' }
  if (content.length < 1) return { ok: false, error: 'Post cannot be empty.' }
  if (content.length > 500)
    return { ok: false, error: 'Post cannot exceed 500 characters.' }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  })
  if (!post) return { ok: false, error: 'Post not found.' }
  if (post.authorId !== authUser.id) return { ok: false, error: 'Not allowed.' }

  await prisma.post.update({
    where: { id: postId },
    data: { content },
  })

  revalidatePath(path)
  return { ok: true }
}

export async function deletePost(formData: FormData): Promise<PostState> {
  const { authUser } = await requireViewer({ requireUsername: true })

  const postId = mustString(formData.get('postId'))
  const path = mustString(formData.get('path')) || '/feed'

  if (!postId) return { ok: false, error: 'Missing postId.' }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  })
  if (!post) return { ok: false, error: 'Post not found.' }
  if (post.authorId !== authUser.id) return { ok: false, error: 'Not allowed.' }

  await prisma.post.delete({ where: { id: postId } })

  revalidatePath(path)
  return { ok: true }
}

export async function toggleLike(formData: FormData): Promise<void> {
  const { authUser } = await requireViewer({ requireUsername: true })

  const postId = mustString(formData.get('postId'))
  const path = mustString(formData.get('path')) || '/feed'

  if (!postId) return

  const where = {
    userId_postId: {
      userId: authUser.id,
      postId,
    },
  } as const

  const existing = await prisma.like.findUnique({ where })

  if (existing) {
    await prisma.like.delete({ where })
  } else {
    await prisma.like.create({
      data: {
        userId: authUser.id,
        postId,
      },
    })
  }

  revalidatePath(path)
}
