'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { claimUsername } from './actions'
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

type ActionState =
  | { ok: true }
  | { ok: false; error: string; field?: 'username' | 'displayName' }
  | null

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type='submit' className='w-full' disabled={pending}>
      {pending ? 'Saving...' : 'Continue'}
    </Button>
  )
}

export function UsernameForm({
  defaultDisplayName,
}: {
  defaultDisplayName?: string
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    claimUsername,
    null,
  )

  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState(defaultDisplayName ?? '')

  const showError = state && state.ok === false ? state.error : null

  return (
    <div className='mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center p-4'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Choose your username</CardTitle>
          <CardDescription>
            This will be your unique handle and part of your profile URL.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            action={(fd) => {
              fd.set('username', username.trim().toLowerCase())
              fd.set('displayName', displayName.trim())
              formAction(fd)
            }}
            className='space-y-4'
          >
            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                }}
                placeholder='e.g. pk_art'
                autoComplete='off'
                required
              />
              <p className='text-xs text-muted-foreground'>
                3-20 chars. Letters, numbers, underscores. Starts with a letter.
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='displayName'>Display name (optional)</Label>
              <Input
                id='displayName'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder='Name others will see'
                autoComplete='name'
              />
            </div>

            {showError ? (
              <div className='rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive'>
                {showError}
              </div>
            ) : null}

            <SubmitButton />
          </form>
        </CardContent>

        <CardFooter className='text-xs text-muted-foreground'>
          You can change your display name later. Username will be your handle.
        </CardFooter>
      </Card>
    </div>
  )
}
