import CreateCategoryForm from '@/components/forms/CreateCategoryForm';
import { Spinner } from '@/components/ui/spinner';
import { requireAdmin } from '@/lib/auth/require-admin';
import { Suspense } from 'react';

const AuthorizedToCreateCategory = async () => {
  await requireAdmin();

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
