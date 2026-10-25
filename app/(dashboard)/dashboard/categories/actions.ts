'use server';

import { Prisma } from '@/app/generated/prisma/client';
import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

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

  // TODO: Prevent deletion when forums are associated with this category.
  // Implement when the Forum model and its relationship are introduced.

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

    throw error;
  }
};
