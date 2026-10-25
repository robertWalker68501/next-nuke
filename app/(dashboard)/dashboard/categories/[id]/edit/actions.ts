'use server';

import { Prisma } from '@/app/generated/prisma/client';
import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';
import { editCategorySchema } from '@/lib/schemas/CategorySchema';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

type EditCategoryProps = {
  id: string;
  name: string;
  description: string | null;
};

export const editCategory = async ({
  id,
  name,
  description,
}: EditCategoryProps) => {
  // Authentication / Authorization
  await requireAdmin();

  // Validate submitted data
  const validatedFields = editCategorySchema.safeParse({
    id,
    name,
    description: description ?? '',
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid category data',
    };
  }

  const {
    id: validatedId,
    name: validatedName,
    description: validatedDescription,
  } = validatedFields.data;

  // Validate the category exists
  const category = await prisma.category.findUnique({
    where: {
      id: validatedId,
    },
  });

  if (!category) {
    return {
      success: false,
      error: 'Category does not exist.',
    };
  }

  // Handle slug regeneration
  const nameChanged = validatedName !== category.name;

  const slug = nameChanged
    ? slugify(validatedName, {
        lower: true,
        strict: true,
        trim: true,
      })
    : category.slug;

  if (!slug) {
    return {
      success: false,
      error: 'Category name must contain letters or numbers.',
    };
  }

  // Duplicate slug protection
  const existingCategory = await prisma.category.findFirst({
    where: {
      slug,
      id: {
        not: validatedId,
      },
    },
  });

  if (existingCategory) {
    return {
      success: false,
      error: 'A category with this name already exists.',
    };
  }

  // Update category
  try {
    await prisma.category.update({
      where: {
        id: validatedId,
      },
      data: {
        name: validatedName,
        description: validatedDescription || null,
        slug,
      },
    });

    revalidatePath('/dashboard/categories');

    return {
      success: true,
      message: 'Category updated successfully.',
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
