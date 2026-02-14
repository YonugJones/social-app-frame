'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type UpdateProfileState =
  | { ok: true }
  | { ok: false; error: string; field?: 'displayName' | 'bio' | 'image' }

export async function updateProfile(
  _prev: UpdateProfileState | null,
  formData: FormData,
): Promise<UpdateProfileState> {
  const data = await getServerSession()
  const authUser = data?.user
  if (!authUser) redirect('/login')

  const displayName = String(formData.get('displayName') ?? '').trim()
  const bio = String(formData.get('bio') ?? '').trim()
  const image = String(formData.get('image') ?? '').trim()

  if (displayName.length > 30) {
    return {
      ok: false,
      error: 'Display name must be 30 characters or less',
      field: 'displayName',
    }
  }

  if (bio.length > 280) {
    return {
      ok: false,
      error: 'Bio must be 280 characters or less',
      field: 'bio',
    }
  }

  if (image.length > 0 && image.length > 2048) {
    return {
      ok: false,
      error: 'Image URL is too long',
      field: 'image',
    }
  }

  const me = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { username: true },
  })
  if (!me?.username) redirect('/onboarding/username')

  await prisma.user.update({
    where: { id: authUser.id },
    data: {
      displayName: displayName || null,
      bio: bio || null,
      image: image || null,
    },
    select: { id: true },
  })

  revalidatePath('/settings/profile')
  if (me.username) revalidatePath(`/profile/${me.username}`)

  return { ok: true }
}
