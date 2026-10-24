import GoBackButton from '@/components/GoBackButton';
import { Spinner } from '@/components/ui/spinner';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { type ReactNode, Suspense } from 'react';

async function GuestOnlyLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect('/dashboard');

  return (
    <div className='my-5 flex flex-col gap-4'>
      <div className='absolute top-5 left-5'>
        <GoBackButton
          href='/'
          text='Back'
        />
      </div>
      <div className='flex min-h-dvh flex-col items-center justify-center'>
        {children}
      </div>
    </div>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-dvh items-center justify-center'>
          <Spinner />
        </div>
      }
    >
      <GuestOnlyLayout>{children}</GuestOnlyLayout>
    </Suspense>
  );
}
