import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import AuthButtons from './AuthButtons';
import { UserMenu } from '../UserMenu';

export default async function UserSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session ? <UserMenu user={session.user} /> : <AuthButtons />;
}
