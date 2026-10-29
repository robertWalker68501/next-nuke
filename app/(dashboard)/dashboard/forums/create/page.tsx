import CreateForumForm from '@/components/forms/CreateForumForm';
import { Spinner } from '@/components/ui/spinner';
import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';
import { Suspense } from 'react';

const AuthorizedCreateForum = async () => {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div>
      <CreateForumForm categories={categories} />
    </div>
  );
};

const CreateForumPage = () => {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-dvh items-center justify-center'>
          <Spinner className='h-10 w-10' />
        </div>
      }
    >
      <AuthorizedCreateForum />
    </Suspense>
  );
};

export default CreateForumPage;
