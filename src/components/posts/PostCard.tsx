import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { PostCardData } from '@/types/post'
import { getInitials } from '@/lib/text/getInitials'
import { formatDate } from '@/lib/date/formatDate'
import { LikeButton } from '@/components/posts/LikeButton'

type PostCardProps = {
  post: PostCardData
}

export function PostCard({ post }: PostCardProps) {
  const authorName =
    post.author.displayName ?? post.author.username ?? post.author.id

  const profileHref = post.author.username
    ? `/profile/${post.author.username}`
    : '/onboarding/username'

  const initials = getInitials(authorName)

  const likedByMe = post.likes.length > 0

  return (
    <Card>
      <CardHeader className='space-y-1'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-center gap-3'>
            <Avatar className='h-9 w-9 shrink-0'>
              <AvatarImage
                src={post.author.image ?? undefined}
                alt={authorName}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className='min-w-0'>
              <Link href={profileHref} className='font-medium hover:underline'>
                {authorName}
              </Link>

              {post.author.username && (
                <span className='ml-2 text-sm text-muted-foreground'>
                  @{post.author.username}
                </span>
              )}
            </div>
          </div>

          <time
            className='shrink-0 text-xs text-muted-foreground'
            dateTime={post.createdAt.toISOString()}
          >
            {formatDate(post.createdAt)}
          </time>
        </div>
      </CardHeader>

      <CardContent>
        <p className='whitespace-pre-wrap text-sm leading-6'>{post.content}</p>
      </CardContent>

      <CardFooter className='flex items-center justify-between text-xs text-muted-foreground'>
        <div className='flex gap-4'>
          <span>{post._count.likes} likes</span>
          <Link href={`/post/${post.id}`} className='hover:underline'>
            {post._count.comments} comments
          </Link>
        </div>

        <LikeButton postId={post.id} liked={likedByMe} />
      </CardFooter>
    </Card>
  )
}
