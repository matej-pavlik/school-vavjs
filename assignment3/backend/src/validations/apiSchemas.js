import z from 'zod';

export const rideCreateSchema = z.object({
  body: z
    .object({
      date: z.string().datetime(),
      type: z.enum(['ROUTE', 'DURATION', 'CONSUMPTION']),
      rideTypeId: z.string().uuid().optional().or(z.null()),
      value: z.number().min(1).max(10000),
    })
    .strict(),
});

export const rideDeleteSchema = z.object({
  params: z.object({ id: z.string() }).strict(),
});

export const rideTypeCreateSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).max(30),
      description: z.string().min(1).max(255),
    })
    .strict(),
});

export const rideTypeDeleteSchema = z.object({
  params: z.object({ id: z.string() }).strict(),
});
