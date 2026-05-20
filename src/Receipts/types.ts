export type TourType = 'standard' | 'surf'

export type ReceiptFormValues = {
  receiptDate: Date
  startDate: Date
  progressiveNumber: number
  tour: {
    type: TourType
    amount: number
  }
}
