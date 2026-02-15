import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostCard } from '@/components/posts/PostCard'
import { CreateCommentForm } from '@/components/comments/CreateCommentForm'
import { CommentCard } from '@/components/comments/CommentCard'
import { Separator } from '@/components/ui/separator'
import { makePostCardSelect } from '@/types/post'
import { commentCardSelect } from '@/types/comment'
import { getViewer } from '@/lib/auth/getViewer'

export const dynamic = 'force-dynamic'

type Params = { id: string }
type Props = { params: Promise<Params> }

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const { authUser } = await getViewer()

  const post = await prisma.post.findUnique({
    where: { id },
    select: makePostCardSelect(authUser?.id),
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

      <PostCard post={post} viewerId={authUser?.id} />

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
