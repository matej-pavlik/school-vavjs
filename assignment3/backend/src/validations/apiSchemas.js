import z from 'zod';

export const rideCreateSchema = z.object({
  body: z
    .object({
      date: z.string(),
      type: z.enum(['ROUTE', 'DURATION', 'CONSUMPTION']),
      rideTypeId: z.string().uuid().optional(),
      value: z.number().min(1).max(10000),
    })
    .strict(),
});

export const rideDeleteSchema = z.object({
  params: z.object({ id: z.string() }).strict(),
});
