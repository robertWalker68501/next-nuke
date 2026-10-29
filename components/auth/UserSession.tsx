import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { connection } from 'next/server';
import AuthButtons from './AuthButtons';
import { UserMenu } from '../UserMenu';

export default async function UserSession() {
  await connection();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session ? <UserMenu user={session.user} /> : <AuthButtons />;
}
