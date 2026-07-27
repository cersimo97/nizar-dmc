import { z } from 'zod'

export const schema = z.object({
  docDate: z.date(),
  startDate: z.date(),
  progressiveNumber: z
    .number()
    .min(0, 'Il numero progressivo non può essere minore di 0'),
  tour: z.object({
    type: z.enum(['standard', 'surf']),
    amount: z.number().positive(),
    percAvance: z.int().min(0).max(100),
  }),
  includeSignature: z.boolean(),
})

export type AcompteForm = z.infer<typeof schema>
