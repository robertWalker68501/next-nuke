'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signInUser } from '@/lib/schemas/UserSchema';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from '@/components/ui/toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { FormFieldControl } from '@/components/form-fields/FormFieldControl';
import Link from 'next/link';
import SeparatorWithText from '@/components/SeparatorWithText';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { FcGoogle } from 'react-icons/fc';
import { SiGithub } from 'react-icons/si';

const SignInForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInUser>>({
    resolver: zodResolver(signInUser),
    defaultValues: {
      email: '',
      password: '',
      callbackURL: '/dashboard',
    },
  });

  const onSubmit = (data: z.infer<typeof signInUser>) => {
    const { email, password, callbackURL } = data;

    startTransition(async () => {
      await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: callbackURL && '/dashboard',
        },
        {
          onSuccess: () => {
            toast.add({
              type: 'success',
              title: 'Signed in successfully',
            });
            router.push('/dashboard');
            router.refresh();
          },
          onError: () => {
            toast.add({
              type: 'error',
              title: 'Failed sign in',
            });
          },
        }
      );
    });
  };

  return (
    <Card className='mx-auto max-w-lg'>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to get started</CardDescription>
      </CardHeader>
      <form
        id='sign-in-user-form'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CardContent>
          <FieldGroup>
            <FormFieldControl
              control={form.control}
              name='email'
              label='Email'
              type='email'
              placeholder='john.doe@example.com'
            />
            <FormFieldControl
              control={form.control}
              name='password'
              label='Password'
              type='password'
              placeholder='**********'
            />
            <div className='flex w-full flex-col'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Button
                    type='submit'
                    form='sign-in-user-form'
                    disabled={isPending}
                  >
                    {isPending ? <Spinner /> : 'Sign In'}
                  </Button>
                </div>
                <p className='text-muted-foreground text-sm'>
                  Don&apos;t have an account?{' '}
                  <Link
                    href='/sign-up'
                    className='hover:text-primary'
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
              <SeparatorWithText text='OR' />
              <div className='flex flex-col gap-4'>
                <Button variant='outline'>
                  Sign in with Google <FcGoogle />
                </Button>
                <Button variant='outline'>
                  Sign in with GitHub <SiGithub />
                </Button>
              </div>
            </div>
          </FieldGroup>
        </CardContent>
      </form>
    </Card>
  );
};

export default SignInForm;
