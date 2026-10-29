import * as z from 'zod';

export const createForumSchema = z.object({
  name: z.string().trim().min(1, 'Forum name is required').max(100),
  description: z.string().trim().max(500).optional(),
  categoryId: z.uuid('Please select a valid category.'),
});

export const editForumSchema = createForumSchema.extend({
  id: z.uuid('Invalid forum ID.'),
});
