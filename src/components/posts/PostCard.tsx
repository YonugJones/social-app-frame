import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { PostCardData } from '@/types/post'
import { getInitials } from '@/lib/text/getInitials'
import { formatDate } from '@/lib/date/formatDate'
import { LikeButton } from '@/components/posts/LikeButton'
import { FollowButton } from '@/components/profile/FollowButton'
import { PostCardActions } from '@/components/posts/PostCardActions'

type PostCardProps = {
  post: PostCardData
  viewerId?: string
}

export function PostCard({ post, viewerId }: PostCardProps) {
  const authorName =
    post.author.displayName ?? post.author.username ?? post.author.id
  const initials = getInitials(authorName)

  const profileHref = post.author.username
    ? `/profile/${post.author.username}`
    : '/onboarding/username'

  const likedByMe = post.likes.length > 0

  const isOwner = viewerId ? post.author.id === viewerId : false
  const isFollowingAuthor = viewerId ? post.author.followers.length > 0 : false

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

          {/* right side: follow + time + post actions */}
          <div className='flex items-center gap-2'>
            {viewerId && !isOwner && (
              <FollowButton
                targetUserId={post.author.id}
                isFollowing={isFollowingAuthor}
              />
            )}

            {isOwner && (
              <PostCardActions
                postId={post.id}
                initialContent={post.content}
                path='/feed'
              />
            )}

            <time
              className='shrink-0 text-xs text-muted-foreground'
              dateTime={post.createdAt.toISOString()}
            >
              {formatDate(post.createdAt)}
            </time>
          </div>
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
