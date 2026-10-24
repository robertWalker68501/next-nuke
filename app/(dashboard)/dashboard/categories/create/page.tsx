import CreateCategoryForm from '@/components/forms/CreateCategoryForm';
import { Spinner } from '@/components/ui/spinner';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const AuthorizedToCreateCategory = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // User is not authenticated
  if (!session) {
    redirect('/sign-in');
  }

  // User is authenticated but lacks permission
  if (session.user.role !== 'admin' && session.user.role !== 'owner') {
    redirect('/dashboard');
  }

  return (
    <div>
      <CreateCategoryForm />
    </div>
  );
};

const CreateCategory = () => {
  return (
    <Suspense
      fallback={
        <div className='flex h-25 flex-col items-center justify-center'>
          <Spinner />
        </div>
      }
    >
      <AuthorizedToCreateCategory />
    </Suspense>
  );
};

export default CreateCategory;
