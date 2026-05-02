import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name must be less than 80 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password is too long'),
    role: z.enum(['ADMIN', 'MEMBER'], { message: 'Role must be ADMIN or MEMBER' })
  })
});
