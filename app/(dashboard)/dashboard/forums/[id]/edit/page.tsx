import EditForumForm from '@/components/forms/EditForumForm';
import { Spinner } from '@/components/ui/spinner';
import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import z from 'zod';

type EditForumProps = {
  params: Promise<{ id: string }>;
};

const AuthorizeEditForum = async ({ params }: EditForumProps) => {
  await requireAdmin();

  const { id } = await params;

  const result = z.uuid().safeParse(id);

  if (!result.success) {
    notFound();
  }

  const forum = await prisma.forum.findUnique({
    where: {
      id: result.data,
    },
  });

  if (!forum) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>Edit Forum: {forum.name}</h1>
      <EditForumForm
        forum={forum}
        categories={categories}
      />
    </div>
  );
};

const EditForumPage = ({ params }: EditForumProps) => {
  return (
    <Suspense
      fallback={
        <div>
          <Spinner />
        </div>
      }
    >
      <AuthorizeEditForum params={params} />
    </Suspense>
  );
};

export default EditForumPage;
