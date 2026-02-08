import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function FeedPage() {
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
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Feed</h1>
        <p className='text-sm text-muted-foreground'>
          Latest posts from the community
        </p>
      </header>

      <div className='space-y-4'>
        {posts.length === 0 ? (
          <div className='rounded-lg border p-6 text-sm text-muted-foreground'>
            No posts yet. Seed data should create a few. Check your seed.
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className='rounded-lg border p-4'>
              <div className='flex items-baseline justify-between gap-4'>
                <div className='min-w-0'>
                  <Link href={`/profile/${post.author.username}`}>
                    {post.author.displayName ?? post.author.username}
                  </Link>
                  <span className='ml-2 text-sm text-muted-foreground'>
                    @{post.author.username}
                  </span>
                </div>

                <time dateTime={post.createdAt.toISOString()}>
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(post.createdAt)}
                </time>
              </div>

              <p className='mt-3 whitespace-pre-wrap text-sm leading-6'>
                {post.content}
              </p>

              <footer className='mt-4 flex gap-4 text-xs text-muted-foreground'>
                <span>{post._count.likes} likes</span>
                <span>{post._count.comments} comments</span>
              </footer>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
