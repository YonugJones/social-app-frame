'use client'

import { usePathname } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { toggleFollow } from '@/app/(app)/profile/actions'

function InnerButton({ isFollowing }: { isFollowing: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      disabled={pending}
      variant={isFollowing ? 'secondary' : 'default'}
    >
      {pending ? '...' : isFollowing ? 'Following' : 'Follow'}
    </Button>
  )
}

export function FollowButton({
  targetUserId,
  isFollowing,
}: {
  targetUserId: string
  isFollowing: boolean
}) {
  const pathname = usePathname()

  return (
    <form action={toggleFollow}>
      <input type='hidden' name='targetUserId' value={targetUserId} />
      <input type='hidden' name='path' value={pathname || '/feed'} />
      <InnerButton isFollowing={isFollowing} />
    </form>
  )
}
