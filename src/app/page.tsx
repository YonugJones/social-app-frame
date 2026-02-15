import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, Speech, CalendarCheck } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className='py-16 md:py-24'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='text-4xl font-bold tracking-tight md:text-6xl'>
            Connect with others
          </h1>
          <p className='mt-6 text-lg text-muted-foreground md:text-xl'>
            Share with the world.
          </p>

          <div className='mt-10 flex flex-col items-center gap-4'>
            <Button asChild size='lg' className='h-12 px-8 text-lg font-medium'>
              <Link href='/register'>Come on in!</Link>
            </Button>
            <p className='text-sm text-muted-foreground'>
              Totally free. Sign up in seconds.
            </p>
          </div>
        </div>
      </section>

      <section className='border-t py-16 md:py-24'>
        <div className='grid gap-12 md:grid-cols-3'>
          <div className='flex flex-col'>
            <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
              <Users className='h-6 w-6 text-primary' />
            </div>
            <h3 className='mb-3 text-2xl font-semibold text-foreground'>
              Follow friends
            </h3>
            <p className='text-muted-foreground'>
              Find your posse and keep on growing.
            </p>
          </div>

          <div className='flex flex-col'>
            <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
              <Speech className='h-6 w-6 text-primary' />
            </div>
            <h3 className='mb-3 text-2xl font-semibold text-foreground'>
              Share your thoughts
            </h3>
            <p className='text-muted-foreground'>
              Write posts and comment on what others have to say.
            </p>
          </div>

          <div className='flex flex-col'>
            <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
              <CalendarCheck className='h-6 w-6 text-primary' />
            </div>
            <h3 className='mb-3 text-2xl font-semibold text-foreground'>
              Stay up to date
            </h3>
            <p className='text-muted-foreground'>
              Never miss out on what those around you are saying.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
