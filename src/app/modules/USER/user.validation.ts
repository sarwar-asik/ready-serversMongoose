import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    role: z.string({
      required_error: 'role is required',
    }),
    email: z.string({
      required_error: 'email is required',
    }),
    address: z.string({
      required_error: 'Address is required',
    }),
    name: z.object({
      firstName: z.string(),
      lastName: z.string().optional(),
    }),
  }),
});

const updateUserZodSchema = createUserZodSchema.shape.body.partial()

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};