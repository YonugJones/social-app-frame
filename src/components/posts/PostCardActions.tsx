'use client'

import { useMemo, useState } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { updatePost, deletePost } from '@/app/(app)/post/actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function PostCardActions({
  postId,
  initialContent,
  path,
}: {
  postId: string
  initialContent: string
  path: string
}) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [content, setContent] = useState(initialContent)
  const [error, setError] = useState<string | null>(null)

  const canSave = useMemo(() => content.trim().length > 0, [content])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' aria-label='Post actions'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-40'>
          <DropdownMenuItem onSelect={() => setOpenEdit(true)}>
            <Pencil className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setOpenDelete(true)}>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit post</DialogTitle>
            <DialogDescription>Update your post content.</DialogDescription>
          </DialogHeader>

          <div className='space-y-3'>
            <Textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                if (error) setError(null)
              }}
              rows={5}
            />

            {error ? (
              <div className='rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive'>
                {error}
              </div>
            ) : null}

            <form
              action={async () => {
                const fd = new FormData()
                fd.set('postId', postId)
                fd.set('content', content)
                fd.set('path', path)
                const res = await updatePost(fd)
                if (!res.ok) {
                  setError(res.error)
                  return
                }
                setOpenEdit(false)
              }}
              className='flex justify-end gap-2'
            >
              <Button
                type='button'
                variant='secondary'
                onClick={() => setOpenEdit(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={!canSave}>
                Save
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <form
              action={async () => {
                const fd = new FormData()
                fd.set('postId', postId)
                fd.set('path', path)
                await deletePost(fd)
                setOpenDelete(false)
              }}
            >
              <AlertDialogAction type='submit'>Delete</AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
