import prisma from '@/lib/prisma'
import { PostCard } from '@/components/posts/PostCard'
import type { PostCardData } from '@/types/post'
import { getServerSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export default async function FeedPage() {
  const session = await getServerSession()

  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { username: true, displayName: true, imageUrl: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  })

  return (
    <div className='space-y-6'>
      {/* Temporary */}
      <div className='rounded-lg border p-4 text-sm'>
        <div className='font-medium'>Session</div>
        <pre className='mt-2 whitespace-pre-wrap text-xs text-muted-foreground'>
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

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
