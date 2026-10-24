import { Spinner } from '@/components/ui/spinner';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

const AuthorizedCategoriesList = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/sign-in');

  if (session.user.role !== 'admin' && session.user.role !== 'owner') {
    redirect('/dashboard');
  }

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });

  return (
    <div>
      <div className='mb-5 flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Categories</h1>
        <Link
          href='/dashboard/categories/create'
          className={buttonVariants({ size: 'sm' })}
        >
          Create Category
        </Link>
      </div>
      {categories.length === 0 ? (
        <p>No categories have been created yet</p>
      ) : (
        <div className='flex flex-col gap-4'>
          {categories.map((category) => (
            <Item
              key={category.id}
              variant='outline'
            >
              <ItemContent>
                <ItemTitle>{category.name}</ItemTitle>
                <ItemDescription>{category.description}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryPage = async () => {
  return (
    <Suspense
      fallback={
        <div className='flex h-25 flex-col items-center justify-center'>
          <Spinner />
        </div>
      }
    >
      <AuthorizedCategoriesList />
    </Suspense>
  );
};

export default CategoryPage;
