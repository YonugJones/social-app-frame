'use client'

import { usePathname } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleLike } from '../../app/(app)/post/actions'

function InnerButton({ liked }: { liked: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      variant='ghost'
      size='sm'
      disabled={pending}
      className='gap-2'
      aria-pressed={liked}
    >
      <Heart className={liked ? 'fill-current' : ''} />
      <span>{pending ? '...' : liked ? 'Liked' : 'Like'}</span>
    </Button>
  )
}

export function LikeButton({
  postId,
  liked,
}: {
  postId: string
  liked: boolean
}) {
  const pathname = usePathname()

  return (
    <form action={toggleLike}>
      <input type='hidden' name='postId' value={postId} />
      <input type='hidden' name='path' value={pathname || '/feed'} />
      <InnerButton liked={liked} />
    </form>
  )
}
