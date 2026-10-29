'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';
import { Prisma } from '@/app/generated/prisma/client';
import { createForumSchema } from '@/lib/schemas/ForumSchema';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

export const createForum = async ({
  name,
  description,
  categoryId,
}: {
  name: string;
  description?: string;
  categoryId: string;
}) => {
  // Authorization
  await requireAdmin();

  // Validate data
  const validatedFields = createForumSchema.safeParse({
    name,
    description,
    categoryId,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid forum information.',
    };
  }

  const {
    name: validatedName,
    description: validatedDescription,
    categoryId: validatedCategoryId,
  } = validatedFields.data;

  // Category verification
  const existingCategory = await prisma.category.findUnique({
    where: {
      id: validatedCategoryId,
    },
  });

  if (!existingCategory) {
    return {
      success: false,
      error: 'Category does not exist.',
    };
  }

  // Slug generation
  const slug = slugify(validatedName, {
    lower: true,
    strict: true,
    trim: true,
  });

  if (!slug) {
    return {
      success: false,
      error: 'Forum name must contain letters or numbers.',
    };
  }

  // Find the highest existing sortOrder
  const result = await prisma.forum.aggregate({
    where: {
      categoryId: validatedCategoryId,
    },
    _max: {
      sortOrder: true,
    },
  });

  // Calculate the next position
  const sortOrder = (result._max.sortOrder ?? -1) + 1;

  // Save to database
  try {
    await prisma.forum.create({
      data: {
        name: validatedName,
        description: validatedDescription || null,
        categoryId: validatedCategoryId,
        slug,
        sortOrder,
      },
    });

    revalidatePath('/dashboard/forums');

    return {
      success: true,
      message: 'Forum created successfully.',
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'A forum with this name or URL slug already exists.',
      };
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return {
        success: false,
        error: 'The selected category no longer exists.',
      };
    }

    throw error;
  }
};
