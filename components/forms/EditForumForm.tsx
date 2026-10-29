'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { editForumSchema } from '@/lib/schemas/ForumSchema';
import { Card, CardContent } from '../ui/card';
import { FieldGroup } from '../ui/field';
import { FormFieldControl } from '../form-fields/FormFieldControl';
import { Button } from '../ui/button';
import { useTransition } from 'react';
import { Spinner } from '../ui/spinner';
import { editForum } from '@/app/(dashboard)/dashboard/forums/[id]/edit/actions';
import { toast } from '../ui/toast';
import { useRouter } from 'next/navigation';

type EditForumFormProps = {
  forum: {
    id: string;
    name: string;
    description: string | null;
    categoryId: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
};

const EditForumForm = ({ forum, categories }: EditForumFormProps) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<z.infer<typeof editForumSchema>>({
    resolver: zodResolver(editForumSchema),
    defaultValues: {
      id: forum.id,
      categoryId: forum.categoryId,
      name: forum.name,
      description: forum.description ?? '',
    },
  });

  const onSubmit = (data: z.infer<typeof editForumSchema>) => {
    startTransition(async () => {
      const result = await editForum(data);

      if (result.success) {
        toast.add({
          type: 'success',
          title: result.message,
        });

        router.push('/dashboard/forums');
      } else {
        toast.add({
          type: 'error',
          title: result.error,
        });
      }
    });
  };

  return (
    <Card className='max-w-3xl'>
      <form
        id='edit-forum-form'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CardContent>
          <FieldGroup>
            <FormFieldControl
              control={form.control}
              name='name'
              label='Name'
              type='text'
            />
            <FormFieldControl
              control={form.control}
              name='categoryId'
              label='Category'
              type='select'
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
            <FormFieldControl
              control={form.control}
              name='description'
              label='Description'
              type='textarea'
            />
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                disabled={isPending}
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                type='submit'
                form='edit-forum-form'
                disabled={isPending || !form.formState.isDirty}
              >
                {isPending ? <Spinner /> : 'Update Forum'}
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </form>
    </Card>
  );
};

export default EditForumForm;
