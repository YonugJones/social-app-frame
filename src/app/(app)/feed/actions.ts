'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type CreatePostState = { ok: true } | { ok: false; error: string }

export async function createPost(
  _prev: CreatePostState | null,
  formData: FormData,
): Promise<CreatePostState> {
  const data = await getServerSession()
  const authUser = data?.user

  if (!authUser) redirect('/login')

  const raw = String(formData.get('content') ?? '')
  const content = raw.trim()

  if (!content) return { ok: false, error: 'Post cannot be empty.' }
  if (content.length > 500) {
    return { ok: false, error: 'Post is too long (max 500 characters).' }
  }

  const me = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { username: true },
  })
  if (!me?.username) redirect('/onboarding/username')

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
