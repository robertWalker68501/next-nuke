'use client';

import { useTransition } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { moveForum } from '@/app/(dashboard)/dashboard/forums/actions';
import { toast } from '../ui/toast';

type ForumMoveButtonsProps = {
  id: string;
  isFirst: boolean;
  isLast: boolean;
};

const ForumMoveButtons = ({ id, isFirst, isLast }: ForumMoveButtonsProps) => {
  const [isPending, startTransition] = useTransition();

  const handleMove = (direction: 'up' | 'down') => {
    startTransition(async () => {
      try {
        const result = await moveForum({ id, direction });

        if (result.success) {
          toast.add({
            type: 'success',
            title: result.message,
          });
        } else {
          toast.add({
            type: 'error',
            title: result.error,
          });
        }
      } catch {
        toast.add({
          type: 'error',
          title: 'An unexpected error occurred while moving the forum.',
        });
      }
    });
  };

  return (
    <div className='flex items-center gap-2'>
      <Button
        type='button'
        variant='outline'
        size='icon'
        aria-label='Move forum up'
        disabled={isFirst || isPending}
        onClick={() => handleMove('up')}
      >
        <ArrowUp />
      </Button>
      <Button
        type='button'
        variant='outline'
        size='icon'
        aria-label='Move forum down'
        disabled={isLast || isPending}
        onClick={() => handleMove('down')}
      >
        <ArrowDown />
      </Button>
    </div>
  );
};

export default ForumMoveButtons;
