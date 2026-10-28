'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { moveCategory } from '@/app/(dashboard)/dashboard/categories/actions';
import { toast } from '../ui/toast';

type CategoryMoveButtonsProps = {
  categoryId: string;
  isFirst: boolean;
  isLast: boolean;
};

const CategoryMoveButtons = ({
  categoryId,
  isFirst,
  isLast,
}: CategoryMoveButtonsProps) => {
  const [isPending, startTransition] = useTransition();

  const handleMove = (direction: 'up' | 'down') => {
    startTransition(async () => {
      try {
        const result = await moveCategory({ id: categoryId, direction });

        if (result.success) {
          toast.add({
            type: 'success',
            title:
              'message' in result
                ? result.message
                : 'Category moved successfully.',
          });
        } else {
          toast.add({
            type: 'error',
            title: result.error ?? 'Unable to move category.',
          });
        }
      } catch {
        toast.add({
          type: 'error',
          title: 'An unexpected error occurred while moving the category.',
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
        aria-label='Move category up'
        disabled={isFirst || isPending}
        onClick={() => handleMove('up')}
      >
        <ArrowUp />
      </Button>
      <Button
        type='button'
        variant='outline'
        size='icon'
        aria-label='Move category down'
        disabled={isLast || isPending}
        onClick={() => handleMove('down')}
      >
        <ArrowDown />
      </Button>
    </div>
  );
};

export default CategoryMoveButtons;
