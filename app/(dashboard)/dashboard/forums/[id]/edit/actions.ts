'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';
import { Prisma } from '@/app/generated/prisma/client';
import { editForumSchema } from '@/lib/schemas/ForumSchema';
import slugify from 'slugify';
import { revalidatePath } from 'next/cache';

type EditForumResult =
  { success: true; message: string } | { success: false; error: string };

type EditForumProps = {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
};

export const editForum = async ({
  id,
  name,
  description,
  categoryId,
}: EditForumProps): Promise<EditForumResult> => {
  // Authorization
  await requireAdmin();

  // Validate data
  const validatedFields = editForumSchema.safeParse({
    id,
    name,
    description,
    categoryId,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid forum data.',
    };
  }

  const {
    id: validatedId,
    name: validatedName,
    description: validatedDescription,
    categoryId: validatedCategoryId,
  } = validatedFields.data;

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await prisma.$transaction(
        async (tx): Promise<EditForumResult> => {
          // Validate the category exists
          const category = await tx.category.findUnique({
            where: {
              id: validatedCategoryId,
            },
          });

          if (!category) {
            return {
              success: false,
              error: 'Category does not exist.',
            };
          }

          // Validate the forum exists
          const existingForum = await tx.forum.findUnique({
            where: {
              id: validatedId,
            },
          });

          if (!existingForum) {
            return {
              success: false,
              error: 'Forum does not exist.',
            };
          }

          // Handle slug regeneration
          const nameChanged = validatedName !== existingForum.name;

          const slug = nameChanged
            ? slugify(validatedName, {
                lower: true,
                strict: true,
                trim: true,
              })
            : existingForum.slug;

          if (!slug) {
            return {
              success: false,
              error: 'Forum name must contain letters or numbers.',
            };
          }

          const categoryChanged =
            validatedCategoryId !== existingForum.categoryId;

          if (!categoryChanged) {
            await tx.forum.update({
              where: {
                id: validatedId,
              },
              data: {
                name: validatedName,
                description: validatedDescription || null,
                slug,
              },
            });

            return {
              success: true,
              message: 'Forum updated successfully.',
            };
          } else {
            const lastForum = await tx.forum.aggregate({
              where: {
                categoryId: validatedCategoryId,
              },
              _max: {
                sortOrder: true,
              },
            });

            const newSortOrder = (lastForum._max.sortOrder ?? 0) + 1;

            await tx.forum.update({
              where: {
                id: validatedId,
              },
              data: {
                name: validatedName,
                description: validatedDescription || null,
                slug,
                categoryId: validatedCategoryId,
                sortOrder: newSortOrder,
              },
            });

            const remainingForums = await tx.forum.findMany({
              where: {
                categoryId: existingForum.categoryId,
              },
              orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
              select: {
                id: true,
                sortOrder: true,
              },
            });

            for (const [index, forum] of remainingForums.entries()) {
              const sortOrder = index + 1;

              if (forum.sortOrder !== sortOrder) {
                await tx.forum.update({
                  where: {
                    id: forum.id,
                  },
                  data: {
                    sortOrder,
                  },
                });
              }
            }

            return {
              success: true,
              message: 'Forum updated successfully.',
            };
          }
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

        if (error.code === 'P2002') {
          return {
            success: false,
            error: 'A forum with this name already exists.',
          };
        }

        if (error.code === 'P2025') {
          return {
            success: false,
            error: 'Forum no longer exists.',
          };
        }
      }

      console.error('Failed to update forum:', error);

      return {
        success: false,
        error: 'An unexpected error occurred while updating the forum.',
      };
    }
  }

  return {
    success: false,
    error: 'Unable to update the forum. Please try again.',
  };
};
