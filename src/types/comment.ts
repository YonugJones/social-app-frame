import type { Prisma } from '@/app/generated/prisma/client'

export const commentCardSelect = {
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
} satisfies Prisma.CommentSelect

export type CommentCardData = Prisma.CommentGetPayload<{
  select: typeof commentCardSelect
}>
