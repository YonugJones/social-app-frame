import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { Globe, User2, Pencil, Rss, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { getInitials } from '@/lib/text/getInitials'

export async function AppNav() {
  const data = await getServerSession()
  const authUser = data?.user ?? null

  const appUser = authUser
    ? await prisma.user.findUnique({
        where: { id: authUser.id },
        select: {
          username: true,
          displayName: true,
          image: true,
          email: true,
          name: true,
        },
      })
    : null

  const profileHref = appUser?.username
    ? `/profile/${appUser.username}`
    : '/onboarding/username'

  const primaryName =
    appUser?.displayName ?? appUser?.username ?? appUser?.email
  const secondaryName = appUser?.name ?? appUser?.email
  const initials = getInitials(primaryName ?? secondaryName ?? '?')

  return (
    <header className='border-b'>
      <div className='mx-auto flex h-14 max-w-5xl items-center justify-between px-4'>
        <Link
          href='/'
          className='flex items-center gap-2 font-semibold tracking-tight'
        >
          <Globe className='h-5 w-5' />
          Social App Frame
        </Link>

        <nav className='flex items-center gap-2'>
          {appUser && authUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type='button'
                  className='rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                  aria-label='Open user menu'
                >
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={appUser.image ?? undefined} />
                    <AvatarFallback className='bg-primary text-primary-foreground'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end' className='w-72'>
                {/* Unclickable summary */}
                <div className='flex items-center gap-3 px-3 py-2'>
                  <Avatar className='h-10 w-10 shrink-0'>
                    <AvatarImage src={appUser.image ?? undefined} />
                    <AvatarFallback className='bg-primary text-primary-foreground'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium leading-none'>
                      {primaryName}
                    </p>
                    <p className='truncate text-xs text-muted-foreground'>
                      {secondaryName}
                    </p>
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* View / Edit Profile */}
                <DropdownMenuItem asChild className='cursor-pointer'>
                  <Link
                    href={profileHref}
                    className='flex w-full items-center gap-2'
                  >
                    <User2 className='h-4 w-4' />
                    View Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className='cursor-pointer'>
                  <Link
                    href='/settings/profile'
                    className='flex w-full items-center gap-2'
                  >
                    <Pencil className='h-4 w-4' />
                    Edit Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Feeds */}
                <DropdownMenuItem asChild className='cursor-pointer'>
                  <Link
                    href='/feed?tab=following'
                    className='flex w-full items-center gap-2'
                  >
                    <Rss className='h-4 w-4' />
                    My Feed
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className='cursor-pointer'>
                  <Link href='/feed' className='flex w-full items-center gap-2'>
                    <Globe className='h-4 w-4' />
                    Community Feed
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem className='p-0'>
                  <LogoutButton
                    className='w-full justify-start rounded-none'
                    variant='ghost'
                    size='sm'
                    label='Log out'
                    icon={<LogOut className='h-4 w-4' />}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant='ghost' size='sm'>
                <Link href='/login'>Sign in</Link>
              </Button>
              <Button asChild size='sm'>
                <Link href='/register'>Create an account</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
