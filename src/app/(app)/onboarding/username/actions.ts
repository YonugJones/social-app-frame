'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

type ActionState =
  | { ok: true }
  | { ok: false; error: string; field?: 'username' | 'displayName' }
  | null

function normalizeUsername(input: string) {
  return input.trim().toLowerCase()
}

function isValidUsername(username: string) {
  return /^[a-z][a-z0-9_]{2,19}$/.test(username)
}

export async function claimUsername(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const sessionData = await getServerSession()
  const authUser = sessionData?.user

  if (!authUser) {
    return { ok: false, error: 'You must be signed in.' }
  }

  const rawUsername = String(formData.get('username') ?? '')
  const rawDisplayName = String(formData.get('displayName') ?? '')

  const username = normalizeUsername(rawUsername)
  const displayName = rawDisplayName.trim()

  if (!username) {
    return { ok: false, error: 'Username is required.', field: 'username' }
  }

  if (!isValidUsername(username)) {
    return {
      ok: false,
      error:
        'Username must be 3-20 chars, start with a letter, and contain only letters, numbers, or underscores.',
      field: 'username',
    }
  }

  const me = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { id: true, username: true },
  })

  if (!me) {
    return { ok: false, error: 'User record not found. Try signing in again.' }
  }

  if (me.username) {
    redirect(`/profile/${me.username}`)
  }

  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  })

  if (existing) {
    return { ok: false, error: 'That username is taken.', field: 'username' }
  }

  await prisma.user.update({
    where: { id: authUser.id },
    data: {
      username,
      ...(displayName ? { displayName } : {}),
    },
    select: { id: true },
  })

  redirect(`/profile/${username}`)
}
