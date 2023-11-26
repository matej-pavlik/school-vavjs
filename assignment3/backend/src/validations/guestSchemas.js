import z from 'zod';

export const loginSchema = z.object({
  body: z
    .object({
      login: z.string(),
      password: z.string(),
    })
    .strict(),
});

export const registerSchema = z.object({
  body: z
    .object({
      email: z.string().email(),
      username: z.string().min(2).max(20),
      password: z.string().min(5).max(50),
      age: z.number().int().min(1).max(100),
    })
    .strict(),
});
