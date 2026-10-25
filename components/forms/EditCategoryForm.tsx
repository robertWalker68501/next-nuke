'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent } from '../ui/card';
import { createCategorySchema } from '@/lib/schemas/CategorySchema';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { FieldGroup } from '../ui/field';
import { FormFieldControl } from '../form-fields/FormFieldControl';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { editCategory } from '@/app/(dashboard)/dashboard/categories/[id]/edit/actions';
import { toast } from '../ui/toast';

type EditCategoryFormProps = {
  category: {
    id: string;
    name: string;
    description: string | null;
  };
};

const EditCategoryForm = ({ category }: EditCategoryFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category.name,
      description: category.description ?? '',
    },
  });

  const onSubmit = (data: z.infer<typeof createCategorySchema>) => {
    console.log('Form submitted:', data);

    const { name, description } = data;

    startTransition(async () => {
      try {
        const result = await editCategory({
          id: category.id,
          name,
          description: description ?? null,
        });

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

        form.reset();
        router.push('/dashboard/categories');
      } catch {
        toast.add({
          type: 'error',
          title: 'Unable to update category. Please try again.',
        });
      }
    });
  };

  return (
    <Card className='max-w-3xl'>
      <form
        id='edit-category-form'
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log('Form validation failed:', errors);
        })}
      >
        <CardContent>
          <FieldGroup>
            <FormFieldControl
              control={form.control}
              name='name'
              label='Name'
              type='text'
              placeholder=''
            />
            <FormFieldControl
              control={form.control}
              name='description'
              label='Description'
              type='textarea'
              placeholder=''
            />
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => form.reset()}
                disabled={isPending}
              >
                Reset
              </Button>
              <Button
                type='submit'
                form='edit-category-form'
                disabled={isPending}
              >
                {isPending ? <Spinner /> : 'Save Changes'}
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </form>
    </Card>
  );
};

export default EditCategoryForm;
