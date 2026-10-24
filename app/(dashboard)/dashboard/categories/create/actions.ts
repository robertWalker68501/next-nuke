'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createCategorySchema } from '@/lib/schemas/CategorySchema';
import slugify from 'slugify';
import prisma from '@/lib/prisma';
import { Prisma } from '@/app/generated/prisma/client';
import { revalidatePath } from 'next/cache';

export const createCategory = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  // Authentication / Authorization
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error('Unauthorized');

  if (session.user.role !== 'admin' && session.user.role !== 'owner') {
    throw new Error('You are not authorized to use this operation');
  }

  // Validate submitted data
  const validatedFields = createCategorySchema.safeParse({
    name,
    description,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid category information',
    };
  }

  const { name: validatedName, description: validatedDescription } =
    validatedFields.data;

  // Create slug
  const slug = slugify(validatedName, {
    lower: true,
    strict: true,
    trim: true,
  });

  if (!slug) {
    return {
      success: false,
      error: 'Category name must contain letters or numbers.',
    };
  }

  // Find the highest existing sortOrder
  const result = await prisma.category.aggregate({
    _max: {
      sortOrder: true,
    },
  });

  // Calculate the next position
  const sortOrder = (result._max.sortOrder ?? -1) + 1;

  // Save to database
  try {
    await prisma.category.create({
      data: {
        name: validatedName,
        description: validatedDescription,
        slug,
        sortOrder,
      },
    });

    revalidatePath('/dashboard/categories');

    return {
      success: true,
      message: 'Category created successfully.',
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'A category with this name already exists.',
      };
    }

    throw error;
  }
};
