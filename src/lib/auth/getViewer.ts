import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

export const viewerSelect = {
  id: true,
  username: true,
  displayName: true,
  image: true,
  email: true,
  name: true,
} as const

export type ViewerAppUser = Awaited<ReturnType<typeof prisma.user.findUnique>>

export async function getViewer() {
  const data = await getServerSession()
  const authUser = data?.user ?? null

  if (!authUser) {
    return { authUser: null, appUser: null }
  }

  const appUser = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: viewerSelect,
  })

  if (!appUser) {
    return { authUser: null, appUser: null }
  }

  return { authUser, appUser }
}
