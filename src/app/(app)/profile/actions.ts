'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function toggleFollow(formData: FormData) {
  const data = await getServerSession()
  const authUser = data?.user
  if (!authUser) redirect('/login')

  const me = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { username: true },
  })
  if (!me?.username) redirect('/onboarding/username')

  const targetUserId = String(formData.get('targetUserId') ?? '')
  const path = String(formData.get('path') ?? '/feed')

  if (!targetUserId) return
  if (targetUserId === authUser.id) return // No self following

  const where = {
    followerId_followingId: {
      followerId: authUser.id,
      followingId: targetUserId,
    },
  } as const

  const existing = await prisma.follow.findUnique({ where })

  if (existing) {
    await prisma.follow.delete({ where })
  } else {
    await prisma.follow.create({
      data: {
        followerId: authUser.id,
        followingId: targetUserId,
      },
      select: { followerId: true },
    })
  }

  revalidatePath(path)
}
