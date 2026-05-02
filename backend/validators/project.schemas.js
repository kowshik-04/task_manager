import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Project name must be at least 2 characters').max(120, 'Project name must be less than 120 characters'),
    description: z.string().max(2000, 'Description must be less than 2000 characters').optional()
  })
});

export const projectIdParamSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project ID')
  })
});

export const addMemberSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project ID')
  }),
  body: z.object({
    userId: z.string().uuid('Invalid user ID')
  })
});

export const removeMemberSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project ID'),
    userId: z.string().uuid('Invalid user ID')
  })
});
