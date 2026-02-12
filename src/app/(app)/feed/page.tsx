import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import prisma from '@/lib/prisma'
import { PostCard } from '@/components/posts/PostCard'
import type { PostCardData } from '@/types/post'

export const dynamic = 'force-dynamic'

export default async function FeedPage() {
  const data = await getServerSession()
  const authUser = data?.user

  if (!authUser) redirect('/login')

  const me = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { username: true },
  })

  if (!me?.username) redirect('/onboarding/username')

  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { id: true, image: true, username: true, displayName: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  })

  return (
    <div className='space-y-6'>
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Feed</h1>
        <p className='text-sm text-muted-foreground'>
          Latest posts from the community
        </p>
      </header>

      <div className='space-y-4'>
        {posts.length === 0 ? (
          <div className='rounded-lg border p-6 text-sm text-muted-foreground'>
            No posts yet.
          </div>
        ) : (
          (posts as unknown as PostCardData[]).map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  )
}
