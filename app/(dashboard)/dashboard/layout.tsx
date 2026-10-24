import AppSidebar from '@/components/sidebar/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';

async function AuthenticatedDashboard({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/sign-in');

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <div className='w-full'>
        <div>
          <SidebarTrigger />
        </div>
        <main className='p-5'>{children}</main>
      </div>
    </SidebarProvider>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-dvh items-center justify-center'>
          Loading dashboard...
          <Spinner />
        </div>
      }
    >
      <AuthenticatedDashboard>{children}</AuthenticatedDashboard>
    </Suspense>
  );
}
