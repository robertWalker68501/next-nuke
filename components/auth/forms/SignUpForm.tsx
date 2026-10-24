'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { createUserSchema } from '@/lib/schemas/UserSchema';
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

const SignUpForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      callbackURL: '/dashboard',
    },
  });

  const onSubmit = (data: z.infer<typeof createUserSchema>) => {
    const { name, email, password, callbackURL } = data;

    startTransition(async () => {
      await authClient.signUp.email(
        {
          name,
          email,
          password,
          callbackURL: callbackURL && '/dashboard',
        },
        {
          onSuccess: () => {
            toast.add({
              type: 'success',
              title: 'Account created successfully',
              description: 'Check you email to verify your account',
            });
            router.push('/sign-in');
            router.refresh();
          },
          onError: () => {
            toast.add({
              type: 'error',
              title: 'Failed to create',
            });
          },
        }
      );
    });
  };

  return (
    <Card className='mx-auto max-w-lg'>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>All fields are required</CardDescription>
      </CardHeader>
      <form
        id='create-user-form'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CardContent>
          <FieldGroup>
            <FormFieldControl
              control={form.control}
              name='name'
              label='Full Name'
              type='text'
              placeholder='John Doe'
            />
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
            <FormFieldControl
              control={form.control}
              name='confirmPassword'
              label='Confirm Password'
              type='password'
              placeholder='**********'
            />
            <div className='flex w-full flex-col'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    disabled={isPending}
                    onClick={() => form.reset()}
                  >
                    Clear
                  </Button>
                  <Button
                    type='submit'
                    form='create-user-form'
                    disabled={isPending}
                  >
                    {isPending ? <Spinner /> : 'Sign Up'}
                  </Button>
                </div>
                <p className='text-muted-foreground text-sm'>
                  Already have an account?{' '}
                  <Link
                    href='/sign-in'
                    className='hover:text-primary'
                  >
                    Sign In
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

export default SignUpForm;
