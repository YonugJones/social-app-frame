'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setError(null)
  }, [email, password])

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await authClient.signIn.email({
        email,
        password,
      })

      if (res?.error) {
        setError(res.error.message ?? 'Invalid credentials.')
        return
      }

      router.push('/feed')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center p-4'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to continue.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete='email'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete='current-password'
                required
              />
            </div>

            {error ? (
              <div className='rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive'>
                {error}
              </div>
            ) : null}

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className='justify-center text-sm text-muted-foreground'>
          <span>
            No account yet?{' '}
            <Link href='/register' className='text-foreground hover:underline'>
              Create one
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
