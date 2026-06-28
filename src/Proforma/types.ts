import type { TourType } from '@/types/Tour'

export type ReceiptFormValues = {
  receiptDate: Date
  startDate: Date
  progressiveNumber: number
  tour: {
    type: TourType
    amount: number
    split?: boolean
  }
}
