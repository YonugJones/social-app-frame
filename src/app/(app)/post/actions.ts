'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function toggleLike(formData: FormData) {
  const data = await getServerSession()
  const authUser = data?.user

  if (!authUser) redirect('/login')

  const postId = String(formData.get('postId') ?? '')
  const path = String(formData.get('path') ?? '/feed')

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
