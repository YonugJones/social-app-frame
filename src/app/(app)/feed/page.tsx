import Link from 'next/link'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { CreatePostForm } from '@/components/posts/CreatePostForm'
import { PostCard } from '@/components/posts/PostCard'
import { makePostCardSelect } from '@/types/post'
import { Button } from '@/components/ui/button'
import { getViewer } from '@/lib/auth/getViewer'

export const dynamic = 'force-dynamic'

type FeedTab = 'all' | 'following'
type SearchParams = { tab?: FeedTab }

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { tab } = await searchParams
  const activeTab: FeedTab = tab === 'following' ? 'following' : 'all'

  const { authUser, appUser } = await getViewer()
  if (!authUser || !appUser) redirect('/login')
  if (!appUser.username) redirect('/onboarding/username')

  const where =
    activeTab === 'following'
      ? {
          author: {
            followers: {
              some: { followerId: appUser.id },
            },
          },
        }
      : undefined

  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    where,
    select: makePostCardSelect(appUser.id),
  })

  return (
    <div className='space-y-6'>
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Feed</h1>
        <p className='text-sm text-muted-foreground'>
          {activeTab === 'following'
            ? 'Posts from creators you follow'
            : 'Latest posts from the community'}
        </p>
      </header>

      {/* Tabs */}
      <div className='flex items-center gap-2'>
        <Button asChild variant={activeTab === 'all' ? 'default' : 'secondary'}>
          <Link href='/feed'>All</Link>
        </Button>

        <Button
          asChild
          variant={activeTab === 'following' ? 'default' : 'secondary'}
        >
          <Link href='/feed?tab=following'>Following</Link>
        </Button>
      </div>

      <CreatePostForm />

      <div className='space-y-4'>
        {posts.length === 0 ? (
          <div className='rounded-lg border p-6 text-sm text-muted-foreground'>
            {activeTab === 'following'
              ? 'No posts yet. Follow someone to see their posts here'
              : 'No posts yet'}
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} viewerId={appUser.id} />
          ))
        )}
      </div>
    </div>
  )
}
