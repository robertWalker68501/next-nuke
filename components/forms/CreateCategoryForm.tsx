'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { createCategorySchema } from '@/lib/schemas/CategorySchema';
import { Card, CardContent } from '../ui/card';
import { FieldGroup } from '../ui/field';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { FormFieldControl } from '../form-fields/FormFieldControl';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { createCategory } from '@/app/(dashboard)/dashboard/categories/create/actions';
import { toast } from '../ui/toast';

const CreateCategoryForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = (data: z.infer<typeof createCategorySchema>) => {
    const { name, description } = data;

    startTransition(async () => {
      try {
        const result = await createCategory({ name, description });

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
          title: 'Unable to create category. Please try again.',
        });
      }
    });
  };

  return (
    <div>
      <h1 className='mb-5 text-2xl font-semibold'>Create Category</h1>

      <Card className='max-w-3xl'>
        <form
          id='create-category-form'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CardContent>
            <FieldGroup>
              <FormFieldControl
                control={form.control}
                name='name'
                label='Name'
                type='text'
                placeholder='Technology'
              />
              <FormFieldControl
                control={form.control}
                name='description'
                label='Description'
                type='textarea'
                placeholder='Description of the category'
              />
              <div className='flex items-center'>
                <Button
                  form='create-category-form'
                  type='submit'
                  disabled={isPending}
                >
                  {isPending ? <Spinner /> : 'Create Category'}
                </Button>
              </div>
            </FieldGroup>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default CreateCategoryForm;
