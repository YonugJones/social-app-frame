import type { Prisma } from '@/app/generated/prisma/client'

export const profileHeaderSelect = {
  id: true,
  image: true,
  username: true,
  displayName: true,
  bio: true,
  _count: {
    select: {
      posts: true,
      followers: true,
      following: true,
    },
  },
} satisfies Prisma.UserSelect

export type ProfileHeaderUser = Prisma.UserGetPayload<{
  select: typeof profileHeaderSelect
}>
