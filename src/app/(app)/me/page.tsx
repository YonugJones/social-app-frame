import { redirect } from 'next/navigation'
import { getViewer } from '@/lib/auth/getViewer'

export const dynamic = 'force-dynamic'

export default async function MePage() {
  const { authUser, appUser } = await getViewer()

  if (!authUser || !appUser) redirect('/login')
  if (!appUser.username) redirect('/onboarding/username')

  redirect(`/profile/${appUser.username}`)
}
