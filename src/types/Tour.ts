export interface Tour {
  startDate: Date
  endDate: Date
  numPar: number
  assignedBus?: number
}

export type TourType = 'standard' | 'surf'
