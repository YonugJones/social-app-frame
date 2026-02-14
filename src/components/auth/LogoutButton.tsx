'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import { Button } from '@/components/ui/button'

export function LogoutButton({
  className,
  variant = 'ghost',
  size = 'sm',
  label = 'Sign out',
  icon,
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
  label?: string
  icon?: ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    setLoading(true)
    setError(null)
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

  const text = loading ? 'Signing out…' : error ? error : label

  return (
    <Button
      type='button'
      variant={variant}
      size={size}
      className={className}
      disabled={loading}
      onClick={handleLogout}
    >
      {icon ? (
        <span className='mr-2 inline-flex items-center'>{icon}</span>
      ) : null}
      {text}
    </Button>
  )
}
