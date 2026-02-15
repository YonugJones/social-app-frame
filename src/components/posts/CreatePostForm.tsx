'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createPost } from '@/app/(app)/post/actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ActionState = { ok: true } | { ok: false; error: string }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Posting...' : 'Post'}
    </Button>
  )
}

export function CreatePostForm() {
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    createPost,
    null,
  )
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    if (state?.ok) formRef.current?.reset()
  }, [state])

  return (
    <Card>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-base'>Create a post</CardTitle>
      </CardHeader>

      <CardContent className='space-y-3'>
        <form ref={formRef} action={formAction} className='space-y-3'>
          <Textarea
            name='content'
            placeholder='Share something…'
            rows={4}
            maxLength={500}
            required
          />

          {state && state.ok === false ? (
            <div className='rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive'>
              {state.error}
            </div>
          ) : null}

          <div className='flex items-center justify-between'>
            <p className='text-xs text-muted-foreground'>Max 500 characters.</p>
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
