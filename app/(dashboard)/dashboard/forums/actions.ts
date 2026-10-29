'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';
import { Prisma } from '@/app/generated/prisma/client';
import z from 'zod';
import { revalidatePath } from 'next/cache';

type DeleteForumResult =
  { success: true; message: string } | { success: false; error: string };

export const deleteForum = async (id: string): Promise<DeleteForumResult> => {
  // Authorization
  await requireAdmin();

  // Validate Id
  const validatedId = z.uuid().safeParse(id);

  if (!validatedId.success) {
    return {
      success: false,
      error: 'Invalid forum ID.',
    };
  }

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await prisma.$transaction(
        async (tx): Promise<DeleteForumResult> => {
          // Does forum exist
          const existingForum = await tx.forum.findUnique({
            where: {
              id: validatedId.data,
            },
          });

          if (!existingForum) {
            return {
              success: false,
              error: 'Forum does not exist.',
            };
          }

          // Delete forum
          await tx.forum.delete({
            where: {
              id: validatedId.data,
            },
          });

          // Update the remaining forums' sort order
          await tx.forum.updateMany({
            where: {
              categoryId: existingForum.categoryId,
              sortOrder: {
                gt: existingForum.sortOrder,
              },
            },
            data: {
              sortOrder: {
                decrement: 1,
              },
            },
          });

          return {
            success: true,
            message: 'Forum deleted successfully.',
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      );

      if (result.success) {
        revalidatePath('/dashboard/forums');
      }

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2034' && attempt < MAX_RETRIES) {
          continue;
        }

        if (error.code === 'P2025') {
          return {
            success: false,
            error: 'Forum does not exist.',
          };
        }

        if (error.code === 'P2003') {
          return {
            success: false,
            error: 'This forum has related content and cannot be deleted.',
          };
        }
      }

      console.error('Failed to delete forum:', error);

      return {
        success: false,
        error: 'An error occurred while deleting the forum.',
      };
    }
  }

  return {
    success: false,
    error: 'Unable to delete the forum after multiple attempts.',
  };
};

// Move forums

type ForumSortProps = {
  id: string;
  direction: 'up' | 'down';
};

type MoveForumResult =
  { success: true; message: string } | { success: false; error: string };

export const moveForum = async ({
  id,
  direction,
}: ForumSortProps): Promise<MoveForumResult> => {
  // Authorization
  await requireAdmin();

  // Validate id
  const validatedId = z.uuid().safeParse(id);

  if (!validatedId.success) {
    return {
      success: false,
      error: 'Invalid forum ID.',
    };
  }

  // Validate direction
  const validatedDirection = z.enum(['up', 'down']).safeParse(direction);

  if (!validatedDirection.success) {
    return { success: false, error: 'Invalid forum direction.' };
  }

  // Forum reordering
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await prisma.$transaction(
        async (tx): Promise<MoveForumResult> => {
          const existingForum = await tx.forum.findUnique({
            where: { id: validatedId.data },
            select: {
              id: true,
              categoryId: true,
              sortOrder: true,
            },
          });

          if (!existingForum) {
            return {
              success: false,
              error: 'Forum does not exist.',
            };
          }

          // Forums in the category
          const forums = await tx.forum.findMany({
            where: {
              categoryId: existingForum.categoryId,
            },
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
            select: { id: true, sortOrder: true },
          });

          // Find the current forum's index
          const currentIndex = forums.findIndex(
            (forum) => forum.id === existingForum.id
          );

          // Calculate the neighboring index
          const targetIndex =
            validatedDirection.data === 'up'
              ? currentIndex - 1
              : currentIndex + 1;

          // Check the boundaries
          if (
            currentIndex === -1 ||
            targetIndex < 0 ||
            targetIndex >= forums.length
          ) {
            return {
              success: false,
              error: 'Forum cannot be moved in that direction.',
            };
          }

          // Retrieve the neighboring forum
          const targetForum = forums[targetIndex];

          // Swap the sort orders
          await tx.forum.update({
            where: { id: existingForum.id },
            data: {
              sortOrder: targetForum.sortOrder,
            },
          });

          await tx.forum.update({
            where: {
              id: targetForum.id,
            },
            data: {
              sortOrder: existingForum.sortOrder,
            },
          });

          return {
            success: true,
            message: 'Forum moved successfully.',
          };
        },
        {
          // Serializable transaction isolation
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      );

      if (result.success) {
        revalidatePath('/dashboard/forums');
      }

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2034' && attempt < maxAttempts) {
          continue;
        }

        if (error.code === 'P2025') {
          return {
            success: false,
            error: 'Forum does not exist.',
          };
        }
      }

      console.error('Failed to move forum:', error);

      return {
        success: false,
        error: 'An error occurred while moving the forum.',
      };
    }
  }

  return {
    success: false,
    error: 'Unable to move the forum after multiple attempts.',
  };
};
