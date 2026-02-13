import prisma from '@/lib/prisma'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { PostCard } from '@/components/posts/PostCard'
import { CreateCommentForm } from '@/components/comments/CreateCommentForm'
import { CommentCard } from '@/components/comments/CommentCard'
import { Separator } from '@/components/ui/separator'
import { makePostCardSelect } from '@/types/post'
import { commentCardSelect } from '@/types/comment'

export const dynamic = 'force-dynamic'

type Params = { id: string }
type Props = { params: Promise<Params> }

export default async function PostPage({ params }: Props) {
  const { id } = await params

  const data = await getServerSession()
  const authUser = data?.user
  if (!authUser) redirect('/login')

  const me = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { username: true },
  })
  if (!me?.username) redirect('/onboarding/username')

  const post = await prisma.post.findUnique({
    where: { id },
    select: makePostCardSelect(authUser.id),
  })
  if (!post) notFound()

  const comments = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: commentCardSelect,
  })

  return (
    <div className='space-y-6'>
      <header className='flex items-baseline justify-between'>
        <h1 className='text-2xl font-semibold tracking-tight'>Post</h1>
        <Link
          href='/feed'
          className='text-sm text-muted-foreground hover:underline'
        >
          Back to feed
        </Link>
      </header>

      <PostCard post={post} />

      <Separator />

      <CreateCommentForm postId={post.id} />

      <section className='space-y-4'>
        <div className='text-sm text-muted-foreground'>
          {comments.length} comment{comments.length === 1 ? '' : 's'}
        </div>

        {comments.length === 0 ? (
          <div className='rounded-lg border p-6 text-sm text-muted-foreground'>
            No comments yet.
          </div>
        ) : (
          <div className='space-y-3'>
            {comments.map((c) => (
              <CommentCard key={c.id} comment={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
