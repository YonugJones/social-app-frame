import type { Prisma } from '@/app/generated/prisma/client'

export const postCardSelect = {
  id: true,
  content: true,
  createdAt: true,
  author: {
    select: {
      id: true,
      image: true,
      username: true,
      displayName: true,
    },
  },
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
} satisfies Prisma.PostSelect

export type PostCardData = Prisma.PostGetPayload<{
  select: typeof postCardSelect
}>
