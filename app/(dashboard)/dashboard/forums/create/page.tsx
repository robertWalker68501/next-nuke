import CreateForumForm from '@/components/forms/CreateForumForm';
import { Spinner } from '@/components/ui/spinner';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const AuthorizedCreateForum = async () => {
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
      <CreateForumForm />
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
