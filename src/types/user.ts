import type { Prisma } from '@/app/generated/prisma/client'

const NO_VIEWER = '__no_viewer__'

export const makeProfileHeaderSelect = (viewerId?: string) =>
  ({
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

    // 0 or 1 row: does the viewer follow THIS user?
    followers: {
      where: {
        followerId: viewerId ?? NO_VIEWER,
      },
      select: { followerId: true },
      take: 1,
    },
  }) satisfies Prisma.UserSelect

export type ProfileHeaderUser = Prisma.UserGetPayload<{
  select: ReturnType<typeof makeProfileHeaderSelect>
}>
