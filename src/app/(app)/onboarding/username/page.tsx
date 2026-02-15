import { redirect } from 'next/navigation'
import { UsernameForm } from './UsernameForm'
import { getViewer } from '@/lib/auth/getViewer'

export const dynamic = 'force-dynamic'

export default async function UsernameOnboardingPage() {
  const { authUser, appUser } = await getViewer()
  if (!authUser || !appUser) redirect('/login')

  if (appUser.username) {
    redirect(`/profile/${appUser.username}`)
  }

  return (
    <UsernameForm defaultDisplayName={appUser.displayName ?? authUser.name} />
  )
}
