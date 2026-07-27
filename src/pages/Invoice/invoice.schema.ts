import { z } from 'zod'

export const schema = z.object({
  receiptDate: z.coerce.date(),
  startDate: z.coerce.date(),
  progressiveNumber: z.int().min(0),
  tour: z.object({
    type: z.enum(['standard', 'surf']),
    amount: z.number().positive(),
  }),
})

export type InvoiceForm = z.infer<typeof schema>
