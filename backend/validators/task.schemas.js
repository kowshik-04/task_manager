import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Task title must be at least 2 characters').max(150, 'Task title must be less than 150 characters'),
    description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
    dueDate: z.string().datetime('Invalid date format').optional(),
    assignedToId: z.string().uuid('Invalid assignee ID').optional(),
    projectId: z.string().uuid('Invalid project ID')
  })
});

export const updateTaskStatusSchema = z.object({
  params: z.object({
    taskId: z.string().uuid('Invalid task ID')
  }),
  body: z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], { message: 'Status must be TODO, IN_PROGRESS, or DONE' })
  })
});

export const projectTaskListSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project ID')
  })
});
