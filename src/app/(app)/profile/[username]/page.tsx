import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type ProfilePageProps = {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  if (!username) notFound()

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      imageUrl: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
      posts: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: {
            select: { likes: true, comments: true },
          },
        },
      },
    },
  })

  if (!user) notFound()

  return (
    <div className='space-y-6'>
      <header className='border rounded-lg p-4'>
        <div className='flex items-start'>
          <div className='min-w-0 space-y-1'>
            <h1 className='truncate text-2xl font-semibold tracking-tight'>
              {user.displayName ?? user.username}
            </h1>
            <p className='text-sm text-muted-foreground'>@{user.username}</p>
            {user.bio ? (
              <p className='pt-2 text-sm leading-6'>{user.bio}</p>
            ) : (
              <p className='pt-2 text-sm text-muted-foreground'>No bio yet.</p>
            )}
          </div>

          {/* Placehoder for profile picture */}
          <div className='border h-12 w-12 rounded-full shrink-0' />
        </div>

        <div className='mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground'>
          <span>
            <span className='font-medium text-foreground'>
              {user._count.posts}
            </span>{' '}
            posts
          </span>
          <span>
            <span className='font-medium text-foreground'>
              {user._count.followers}
            </span>{' '}
            followers
          </span>
          <span>
            <span className='font-medium text-foreground'>
              {user._count.following}
            </span>{' '}
            following
          </span>
        </div>
      </header>

      <section className='space-y-4'>
        <div className='flex items-baseline justify-between'>
          <h2 className='text-lg font-semibold tracking-tight'>Posts</h2>
          <Link
            className='text-sm text-muted-foreground hover:underline'
            href='/feed'
          >
            Back to feed
          </Link>
        </div>

        {user.posts.length === 0 ? (
          <div>No posts yet</div>
        ) : (
          user.posts.map((post) => (
            <article key={post.id} className='border p-4 rounded-lg'>
              <time
                dateTime={post.createdAt.toISOString()}
                className='text-xs text-muted-foreground'
              >
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }).format(post.createdAt)}
              </time>

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
      </section>
    </div>
  )
}
