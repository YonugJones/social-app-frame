import type { Prisma } from '@/app/generated/prisma/client'

const NO_VIEWER = '__no_viewer__'

export const makePostCardSelect = (viewerId?: string) =>
  ({
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
    // Fetch at most 1 Like row for the current viewer
    likes: {
      where: { userId: viewerId ?? NO_VIEWER },
      select: { userId: true },
      take: 1,
    },
  }) satisfies Prisma.PostSelect

export type PostCardData = Prisma.PostGetPayload<{
  select: ReturnType<typeof makePostCardSelect>
}>
