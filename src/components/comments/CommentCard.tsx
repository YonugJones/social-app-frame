import Link from 'next/link'
import type { CommentCardData } from '@/types/comment'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/text/getInitials'
import { formatDate } from '@/lib/date/formatDate'

type CommentCardProps = {
  comment: CommentCardData
}

export function CommentCard({ comment }: CommentCardProps) {
  const authorName =
    comment.author.displayName ?? comment.author.username ?? comment.author.id
  const initials = getInitials(authorName)

  return (
    <Card>
      <CardHeader className='space-y-1'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-center gap-3'>
            <Avatar className='h-8 w-8 shrink-0'>
              <AvatarImage
                src={comment.author.image ?? undefined}
                alt={authorName}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className='min-w-0'>
              <Link
                href={`/profile/${comment.author.username}`}
                className='font-medium hover:underline'
              >
                {authorName}
              </Link>
              {comment.author.username ? (
                <span className='ml-2 text-sm text-muted-foreground'>
                  @{comment.author.username}
                </span>
              ) : null}
            </div>
          </div>

          <time
            className='shrink-0 text-xs text-muted-foreground'
            dateTime={comment.createdAt.toISOString()}
          >
            {formatDate(comment.createdAt)}
          </time>
        </div>
      </CardHeader>

      <CardContent>
        <p className='whitespace-pre-wrap text-sm leading-6'>
          {comment.content}
        </p>
      </CardContent>
    </Card>
  )
}
