import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
            // Logged in Profile Avatar
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type='button'
                  className='rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                  aria-label='Open user menu'
                >
                  <Avatar className='h-8 w-8'>
                    {/* use image if you have it */}
                    <AvatarImage src={appUser.image ?? undefined} />
                    <AvatarFallback className='bg-primary text-primary-foreground'>
                      {getInitials(
                        appUser.displayName ??
                          appUser.username ??
                          appUser.email,
                      )}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end' className='w-64'>
                {/* Clickable profile row */}
                <DropdownMenuLabel className='p-0'>
                  <DropdownMenuItem
                    asChild
                    className='cursor-pointer px-3 py-2'
                  >
                    <Link href={profileHref} className='w-full'>
                      <div className='flex min-w-0 flex-col'>
                        <p className='truncate text-sm font-medium leading-none'>
                          {appUser?.displayName ??
                            appUser.username ??
                            appUser.email}
                        </p>
                        {appUser.displayName && (
                          <p className='truncate text-xs text-muted-foreground'>
                            {appUser.email}
                          </p>
                        )}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Feed as menu button */}
                <DropdownMenuItem asChild className='cursor-pointer'>
                  <Link href='/feed' className='w-full'>
                    Feed
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem className='p-0'>
                  <LogoutButton
                    className='w-full justify-start rounded-none'
                    variant='ghost'
                    size='sm'
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Non logged in Register/Login buttons
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
