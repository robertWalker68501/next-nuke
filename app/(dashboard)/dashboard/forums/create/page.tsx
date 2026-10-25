import CreateForumForm from '@/components/forms/CreateForumForm';
import { Spinner } from '@/components/ui/spinner';
import { requireAdmin } from '@/lib/auth/require-admin';
import { Suspense } from 'react';

const AuthorizedCreateForum = async () => {
  await requireAdmin();

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
