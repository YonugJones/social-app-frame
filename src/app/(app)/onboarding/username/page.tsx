import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { UsernameForm } from './UsernameForm'

export const dynamic = 'force-dynamic'

export default async function UsernameOnboardingPage() {
  const data = await getServerSession()
  const authUser = data?.user

  if (!authUser) redirect('/login')

  const me = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { username: true, displayName: true, name: true },
  })

  if (me?.username) {
    redirect(`/profile/${me.username}`)
  }

  return <UsernameForm defaultDisplayName={me?.displayName ?? authUser.name} />
}
