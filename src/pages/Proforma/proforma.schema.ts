import { z } from 'zod'

export const schema = z.object({
  receiptDate: z.date('Inserisci la data della fattura'),
  startDate: z.date('Inserisci la data di inizio viaggio'),
  progressiveNumber: z.int().min(0),
  tour: z.object({
    type: z.enum(['standard', 'surf']),
    amount: z.number().positive(),
    split: z.boolean(),
  }),
  includeSignature: z.boolean(),
})

export type ProformaForm = z.infer<typeof schema>
