'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateProfile } from '@/app/(app)/settings/profile/actions'
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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/text/getInitials'

type UpdateProfileState =
  | { ok: true }
  | { ok: false; error: string; field?: 'displayName' | 'bio' | 'image' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Saving...' : 'Save changes'}
    </Button>
  )
}

export function ProfileForm({
  username,
  email,
  name,
  defaultDisplayName,
  defaultBio,
  defaultImage,
}: {
  username: string
  email: string
  name: string
  defaultDisplayName: string
  defaultBio: string
  defaultImage: string
}) {
  const [state, formAction] = useActionState<
    UpdateProfileState | null,
    FormData
  >(updateProfile, null)

  const [displayName, setDisplayName] = useState(defaultDisplayName)
  const [bio, setBio] = useState(defaultBio)
  const [image, setImage] = useState(defaultImage)

  const title = displayName.trim() || name || email
  const initials = getInitials(title)
  const error = state && state.ok === false ? state.error : null

  return (
    <Card className='max-w-xl'>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>@{username}</CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Avatar>
            <AvatarImage src={image || undefined} alt={title} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className='min-w-0'>
            <p className='truncate text-sm font-medium'>{title}</p>
            <p className='truncate text-xs text-muted-foreground'>{email}</p>
          </div>
        </div>

        <form
          action={(fd) => {
            fd.set('displayName', displayName)
            fd.set('bio', bio)
            fd.set('image', image)
            formAction(fd)
          }}
          className='space-y-4'
        >
          <div className='space-y-2'>
            <Label htmlFor='displayName'>Display name</Label>
            <Input
              id='displayName'
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder='Name others will see'
              maxLength={50}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='bio'>Bio</Label>
            <Textarea
              id='bio'
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder='Tell people about yourself...'
              maxLength={280}
            />
            {bio.length < 281 ? (
              <p className='text-xs text-muted-foreground'>
                {280 - bio.length} characters left
              </p>
            ) : (
              <p className='text-xs text-destructive'>
                Exceeded character limit
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='image'>Avatar image URL</Label>
            <Input
              id='image'
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder='https://...'
              inputMode='url'
            />
            <p className='text-xs text-muted-foreground'>
              Paste an image URL here
            </p>
          </div>

          {error && (
            <div className='border rounded-md border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive'>
              {error}
            </div>
          )}

          <CardFooter className='px-0 pb-0'>
            <SubmitButton />
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
