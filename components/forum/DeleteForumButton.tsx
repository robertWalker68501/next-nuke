'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '../ui/button';
import { useState, useTransition } from 'react';
import { deleteForum } from '@/app/(dashboard)/dashboard/forums/actions';
import { toast } from '../ui/toast';

type DeleteForumProps = {
  forumId: string;
  forumName: string;
};

const DeleteForumButton = ({ forumId, forumName }: DeleteForumProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteForum(forumId);

        if (!result.success) {
          toast.add({
            type: 'error',
            title: result.error,
          });
          return;
        }

        toast.add({
          type: 'success',
          title: result.message,
        });

        setOpen(false);
      } catch {
        setOpen(false);

        toast.add({
          type: 'error',
          title: 'Unable to delete forum. Please try again.',
        });
      }
    });
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) setOpen(nextOpen);
      }}
    >
      <AlertDialogTrigger
        render={
          <Button
            variant='destructive'
            disabled={isPending}
          />
        }
      >
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {forumName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the forum &quot;{forumName}
            &quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete Forum'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteForumButton;
