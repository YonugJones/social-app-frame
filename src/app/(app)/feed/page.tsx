import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import prisma from '@/lib/prisma'
import { CreatePostForm } from '@/components/posts/CreatePostForm'
import { PostCard } from '@/components/posts/PostCard'
import { makePostCardSelect } from '@/types/post'

export const dynamic = 'force-dynamic'

export default async function FeedPage() {
  const session = await getServerSession()
  const authUser = session?.user

  if (!authUser) redirect('/login')

  const me = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { username: true },
  })

  if (!me?.username) redirect('/onboarding/username')

  const viewerId = authUser.id

  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    select: makePostCardSelect(viewerId),
  })

  return (
    <div className='space-y-6'>
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Feed</h1>
        <p className='text-sm text-muted-foreground'>
          Latest posts from the community
        </p>
      </header>

      <CreatePostForm />

      <div className='space-y-4'>
        {posts.length === 0 ? (
          <div className='rounded-lg border p-6 text-sm text-muted-foreground'>
            No posts yet.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}
