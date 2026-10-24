'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { createForumSchema } from '@/lib/schemas/ForumSchema';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

const CreateForumForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof createForumSchema>>({
    resolver: zodResolver(createForumSchema),
    defaultValues: {},
  });

  const onSubmit = (data: z.infer<typeof createForumSchema>) => {
    const {} = data;

    startTransition(async () => {});
  };

  return (
    <Card className='max-w-3xl'>
      <CardHeader>
        <CardTitle>Create New Forum</CardTitle>
      </CardHeader>
      <form
        id='create-forum-form'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CardContent>{/* Form fields go here */}</CardContent>
      </form>
    </Card>
  );
};

export default CreateForumForm;
