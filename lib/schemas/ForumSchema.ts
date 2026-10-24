import * as z from 'zod';

export const createForumSchema = z.object({
  name: z.string().trim().min(1, 'Forum name is required').max(100),
  description: z.string().trim().min(1, 'Description is required').max(500),
  categoryId: z.uuid(),
});
