import { requireAdmin } from '@/lib/auth/require-admin';
import { z } from 'zod';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Suspense } from 'react';
import EditCategoryForm from '@/components/forms/EditCategoryForm';

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

const AuthorizeEditCategory = async ({ params }: EditCategoryPageProps) => {
  await requireAdmin();

  const { id } = await params;

  const result = z.uuid().safeParse(id);

  if (!result.success) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: {
      id: result.data,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div>
      <h1 className='mb-5 text-2xl font-semibold'>
        Edit Category: {category.name}
      </h1>
      <EditCategoryForm category={category} />
    </div>
  );
};

export const EditCategoryPage = ({ params }: EditCategoryPageProps) => {
  return (
    <Suspense fallback={<div>Loading category...</div>}>
      <AuthorizeEditCategory params={params} />
    </Suspense>
  );
};

export default EditCategoryPage;
