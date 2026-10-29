import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import DeleteForumButton from '@/components/forum/DeleteForumButton';
import ForumMoveButtons from '@/components/forum/ForumMoveButtons';

const GetForums = async () => {
  // Authentication
  await requireAdmin();

  // Get forums with their category
  const forums = await prisma.forum.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      categoryId: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      { category: { sortOrder: 'asc' } },
      { category: { id: 'asc' } },
      { sortOrder: 'asc' },
      { id: 'asc' },
    ],
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-75'>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className='flex justify-end'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forums.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={3}
              className='text-muted-foreground py-8 text-center'
            >
              No forums have been created yet.
            </TableCell>
          </TableRow>
        ) : (
          forums.map((forum, index) => {
            const isFirst =
              index === 0 || forums[index - 1].categoryId !== forum.categoryId;

            const isLast =
              index === forums.length - 1 ||
              forums[index + 1].categoryId !== forum.categoryId;

            return (
              <TableRow key={forum.id}>
                <TableCell>
                  <div className='flex flex-col gap-1'>
                    <span className='font-medium'>{forum.name}</span>
                    {forum.description && (
                      <span className='text-muted-foreground text-sm'>
                        {forum.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{forum.category.name}</TableCell>
                <TableCell className='flex items-center justify-end gap-2'>
                  <ForumMoveButtons
                    id={forum.id}
                    isFirst={isFirst}
                    isLast={isLast}
                  />
                  <Link
                    href={`/dashboard/forums/${forum.id}/edit`}
                    className={buttonVariants({ variant: 'outline' })}
                  >
                    Edit
                  </Link>
                  <DeleteForumButton
                    forumId={forum.id}
                    forumName={forum.name}
                  />
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

const ForumsPage = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Forums</h1>
        <Link
          href='/dashboard/forums/create'
          className={buttonVariants({})}
        >
          Create Forum
        </Link>
      </div>

      <Suspense
        fallback={
          <div>
            <Spinner />
          </div>
        }
      >
        <GetForums />
      </Suspense>
    </div>
  );
};

export default ForumsPage;
