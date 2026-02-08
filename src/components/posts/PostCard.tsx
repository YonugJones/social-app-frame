import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import type { PostCardData } from '@/types/post'

export function PostCard({ post }: { post: PostCardData }) {
  const authorName = post.author.displayName ?? post.author.username

  return (
    <Card>
      <CardHeader className='space-y-1'>
        <div className='flex items-baseline justify-between gap-4'>
          <div className='min-w-0'>
            <Link
              href={`/profile/${post.author.username}`}
              className='font-medium hover:underline'
            >
              {authorName}
            </Link>
            <span className='ml-2 text-sm text-muted-foreground'>
              @{post.author.username}
            </span>
          </div>

          <time
            className='shrink-0 text-xs text-muted-foreground'
            dateTime={post.createdAt.toISOString()}
          >
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(post.createdAt)}
          </time>
        </div>
      </CardHeader>

      <CardContent>
        <p className='whitespace-pre-wrap text-sm leading-6'>{post.content}</p>
      </CardContent>

      <CardFooter className='gap-4 text-xs text-muted-foreground'>
        <span>{post._count.likes} likes</span>
        <span>{post._count.comments} comments</span>
      </CardFooter>
    </Card>
  )
}
