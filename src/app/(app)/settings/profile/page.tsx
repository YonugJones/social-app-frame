import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { ProfileForm } from '@/components/profile/ProfileForm'

export const dynamic = 'force-dynamic'

export default async function EditProfilePage() {
  const data = await getServerSession()
  const authUser = data?.user
  if (!authUser) redirect('/login')

  const me = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      username: true,
      displayName: true,
      bio: true,
      image: true,
      email: true,
      name: true,
    },
  })

  if (!me) redirect('/login')
  if (!me.username) redirect('/onboarding/username')

  return (
    <div className='space-y-6'>
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Edit Profile</h1>
        <p className='text-sm text-muted-foreground'>
          Update how your profile appears to others
        </p>
      </header>
      <ProfileForm
        username={me.username}
        email={me.email}
        name={me.name}
        defaultDisplayName={me.displayName ?? ''}
        defaultBio={me.bio ?? ''}
        defaultImage={me.image ?? ''}
      />
    </div>
  )
}
