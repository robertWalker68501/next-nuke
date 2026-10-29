'use server';

import { Prisma } from '@/app/generated/prisma/client';
import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

// Delete a category by ID
export const deleteCategory = async (id: string) => {
  await requireAdmin();

  // Validate the ID
  const validatedId = z.uuid().safeParse(id);

  if (!validatedId.success) {
    return {
      success: false,
      error: 'Invalid category ID.',
    };
  }

  // Verify the category exists
  const existingCategory = await prisma.category.findUnique({
    where: {
      id: validatedId.data,
    },
  });

  if (!existingCategory) {
    return {
      success: false,
      error: 'Category does not exist.',
    };
  }

  // Prevent deletion when forums are associated with a category.
  const forumCount = await prisma.forum.count({
    where: {
      categoryId: validatedId.data,
    },
  });

  if (forumCount > 0) {
    return {
      success: false,
      error: 'Cannot delete a category that contains forums.',
    };
  }

  // Delete the category
  try {
    await prisma.category.delete({
      where: {
        id: validatedId.data,
      },
    });

    revalidatePath('/dashboard/categories');

    return {
      success: true,
      message: 'Category deleted successfully.',
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return {
        success: false,
        error: 'Category no longer exists.',
      };
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return {
        success: false,
        error: 'Cannot delete a category that contains forums.',
      };
    }

    throw error;
  }
};

// Move category

type CategorySortProps = {
  id: string;
  direction: 'up' | 'down';
};

export const moveCategory = async ({ id, direction }: CategorySortProps) => {
  await requireAdmin();

  const validatedId = z.uuid().safeParse(id);
  if (!validatedId.success) {
    return { success: false, error: 'Invalid category ID.' };
  }

  const validatedDirection = z.enum(['up', 'down']).safeParse(direction);
  if (!validatedDirection.success) {
    return { success: false, error: 'Invalid category direction.' };
  }

  // Serializable transactions may conflict when multiple admins reorder at once.
  // Retry those conflicts a limited number of times using a fresh database read.
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          const categories = await tx.category.findMany({
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
            select: { id: true, sortOrder: true },
          });

          const currentIndex = categories.findIndex(
            (category) => category.id === validatedId.data
          );

          if (currentIndex === -1) {
            return { success: false, error: 'Category does not exist.' };
          }

          const targetIndex =
            validatedDirection.data === 'up'
              ? currentIndex - 1
              : currentIndex + 1;

          if (targetIndex < 0 || targetIndex >= categories.length) {
            return {
              success: false,
              error: 'Category cannot be moved in that direction.',
            };
          }

          const reorderedCategories = [...categories];
          [
            reorderedCategories[currentIndex],
            reorderedCategories[targetIndex],
          ] = [
            reorderedCategories[targetIndex],
            reorderedCategories[currentIndex],
          ];

          // Normalize all positions to 0, 1, 2, ... (handles gaps and duplicates).
          for (const [index, category] of reorderedCategories.entries()) {
            await tx.category.update({
              where: { id: category.id },
              data: { sortOrder: index },
            });
          }

          return { success: true, message: 'Category moved successfully.' };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );

      if (result.success) {
        revalidatePath('/dashboard/categories');
      }

      return result;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034'
      ) {
        if (attempt < maxAttempts) continue;
        return {
          success: false,
          error:
            'The category order changed while you were updating it. Please try again.',
        };
      }

      throw error;
    }
  }

  return {
    success: false,
    error: 'Unable to reorder categories. Please try again.',
  };
};
