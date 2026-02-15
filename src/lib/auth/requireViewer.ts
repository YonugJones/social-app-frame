import { redirect } from 'next/navigation'
import { getViewer } from '@/lib/auth/getViewer'

export async function requireViewer(opts?: { requireUsername?: boolean }) {
  const { authUser, appUser } = await getViewer()

  if (!authUser || !appUser) redirect('/login')

  if (opts?.requireUsername && !appUser.username) {
    redirect('/onboarding/username')
  }

  return { authUser, appUser }
}
