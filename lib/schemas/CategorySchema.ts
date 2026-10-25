import * as z from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required').max(100),
  description: z.string().trim().max(500).optional(),
});

export const editCategorySchema = createCategorySchema.extend({
  id: z.uuid(),
});
