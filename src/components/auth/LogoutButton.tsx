'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import { Button } from '@/components/ui/button'

export function LogoutButton({
  className,
  variant = 'ghost',
  size = 'sm',
}: {
  className?: string
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await authClient.signOut()
      router.refresh()
      router.push('/login')
    } catch {
      setError('Logout error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type='button'
      variant={variant}
      size={size}
      className={className}
      disabled={loading}
      onClick={handleLogout}
    >
      {loading ? 'Signing out' : error ? error : 'Sign out'}
    </Button>
  )
}
