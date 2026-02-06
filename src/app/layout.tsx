import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
import { SiteHeader } from '@/components/layout/SiteHeader'
import '@/app/globals.css'

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// })

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// })

export const metadata: Metadata = {
  title: 'Social App Frame',
  description: 'A special space for sharing and connecting',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-background text-foreground'>
        <SiteHeader />
        <main className='mx-auto max-w-5xl px-4 py-8'>{children}</main>
      </body>
    </html>
  )
}
