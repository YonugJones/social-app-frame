import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostCard } from '@/components/posts/PostCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { profileHeaderSelect } from '@/types/user'
import { postCardSelect } from '@/types/post'
import { getInitials } from '@/lib/text/getInitials'

export const dynamic = 'force-dynamic'

type ProfileParams = { username: string }

type ProfilePageProps = { params: Promise<ProfileParams> }

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      ...profileHeaderSelect,
      posts: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: postCardSelect,
      },
    },
  })

  if (!user) notFound()

  const profileName = user.displayName ?? user.username ?? user.id
  const initials = getInitials(profileName)

  return (
    <div className='space-y-6'>
      <header className='rounded-lg border p-4'>
        <div className='flex items-start justify-between gap-6'>
          <div className='min-w-0 space-y-1'>
            <h1 className='truncate text-2xl font-semibold tracking-tight'>
              {user.displayName ?? user.username ?? user.id}
            </h1>
            {user.username && (
              <p className='text-sm text-muted-foreground'>@{user.username}</p>
            )}
            {user.bio ? (
              <p className='pt-2 text-sm leading-6'>{user.bio}</p>
            ) : (
              <p className='pt-2 text-sm text-muted-foreground'>No bio yet.</p>
            )}
          </div>

          <Avatar className='h-12 w-12 shrink-0'>
            <AvatarImage src={user.image ?? undefined} alt={profileName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
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
            href='/feed'
            className='text-sm text-muted-foreground hover:underline'
          >
            Back to feed
          </Link>
        </div>

        {user.posts.length === 0 ? (
          <div className='rounded-lg border p-6 text-sm text-muted-foreground'>
            No posts yet.
          </div>
        ) : (
          <div className='space-y-4'>
            {user.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
