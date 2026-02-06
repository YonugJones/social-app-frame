export function SiteHeader() {
  return (
    <header className='border-b'>
      <div className='mx-auto flex h-14 max-w-5xl items-center justify-between px-4'>
        <div className='font-semibold tracking-tight'>Social App Frame</div>
        <nav>
          <button className='text-sm text-muted-foreground'>Log in</button>
          <button className='text-sm font-medium'>Sign up</button>
        </nav>
      </div>
    </header>
  )
}
